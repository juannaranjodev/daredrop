// libs
import { prop, propEq, map, filter, equals, and, not, startsWith } from 'ramda'
import moment from 'moment'
import { ternary } from 'root/src/shared/util/ramdaPlus'
// db stuff
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
// utils
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'
import setupCronJob from 'root/src/server/api/actionUtil/setupCronJob'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { payloadSchemaError, generalError } from 'root/src/server/api/errors'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
// descriptions
import { REVIEW_DELIVERY, PAYOUT_ASSIGNEES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import {
	streamerAcceptedKey, streamerDeliveryApprovedKey,
	projectDeliveredKey, projectDeliveryPendingKey,
	projectApprovedKey, projectToCaptureKey,
} from 'root/src/server/api/lenses'

const payloadLenses = getPayloadLenses(REVIEW_DELIVERY)
const { viewProjectId, viewAudit, viewMessage } = payloadLenses

export default async ({ payload }) => {
	const projectId = viewProjectId(payload)
	const audit = viewAudit(payload)
	const message = viewMessage(payload)

	if (and(not(equals(audit, projectDeliveredKey)), not(message))) {
		throw payloadSchemaError('Message is required')
	}

	const [projectToApproveDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const projectSerialized = projectSerializer([...projectToApproveDdb, ...assigneesDdb], true)
	const projectAcceptedAssignees = filter(propEq('accepted', streamerAcceptedKey), prop('assignees', projectSerialized))

	const assigneesToWrite = ternary(equals(audit, projectDeliveredKey), map(assignee => ({
		PutRequest: {
			Item: {
				...assigneeDynamoObj({
					...assignee,
					accepted: ternary(equals(audit, projectDeliveredKey),
						streamerDeliveryApprovedKey, prop('accepted', assignee)),
				},
				projectId),
			},
		},
	}), projectAcceptedAssignees), [])

	const [recordToArchive] = filter(project => startsWith(`project|${projectDeliveryPendingKey}`, prop('sk', project)), projectToApproveDdb)
	const [recordToUpdate] = filter(project => startsWith(`project|${projectApprovedKey}`, prop('sk', project)), projectToApproveDdb)

	const projectDataToWrite = [
		...ternary(equals(audit, projectDeliveredKey),
			[{
				PutRequest: {
					Item: {
						...recordToArchive,
						[PARTITION_KEY]: prop('id', projectSerialized),
						[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `project|${audit}`, 1, 10),
						created: getTimestamp(),
					},
				},
			},
			{
				PutRequest: {
					Item: {
						...recordToUpdate,
						status: projectDeliveredKey,
						deliveries: prop('deliveries', projectSerialized),
					},
				},
			},
			{
				PutRequest: {
					Item: {
						[PARTITION_KEY]: recordToArchive[PARTITION_KEY],
						[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `${projectToCaptureKey}`, 1, 10),
					},
				},
			}], []),
		...archiveProjectRecord(recordToArchive),
	]

	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [...assigneesToWrite, ...projectDataToWrite],
		},
	}

	await documentClient.batchWrite(writeParams).promise()

	if (equals(audit, projectDeliveredKey)) {
		const capturesAmount = await captureProjectPledges(projectId)

		if (!capturesAmount) {
			throw generalError('captures processing error')
		}
		const projectToCapture = await dynamoQueryProjectToCapture(projectId)
		const captureToWrite = await capturePaymentsWrite(projectToCapture, capturesAmount)

		await documentClient.batchWrite({
			RequestItems: {
				[TABLE_NAME]: captureToWrite,
			},
		}).promise()

		// here I leave 5 minutes for testing purposes
		// const eventDate = moment().add(5, 'days')
		const eventDate = moment().add(5, 'minutes')
		await setupCronJob(
			{
				endpointId: PAYOUT_ASSIGNEES,
				payload: { projectId },
			},
			eventDate, 'projectId',
		)
	}

	return {
		...projectSerialized,
		status: audit,
	}
}
