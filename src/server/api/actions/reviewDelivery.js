import { prop, propEq, map, filter, equals, and, not, reduce, assoc, startsWith } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import {
	streamerAcceptedKey, streamerDeliveryApprovedKey,
	projectDeliveredKey, projectDeliveryPendingKey,
	projectApprovedKey,
} from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { ternary, orNull } from 'root/src/shared/util/ramdaPlus'
import { payloadSchemaError } from 'root/src/server/api/errors'
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'
import capturePayments from 'root/src/server/api/actionUtil/capturePayments'

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

	const projectSerialized = projectSerializer([...projectToApproveDdb, ...assigneesDdb])

	const projectAssignees = prop('assignees', projectSerializer([
		...assigneesDdb,
	]))

	const projectAcceptedAssignees = filter(propEq('accepted', streamerAcceptedKey), projectAssignees)

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

	if (equals(audit, projectDeliveredKey)) {
		const projectPledges = await dynamoQueryProjectPledges(projectId)
		const pledgesToWrite = await reduce(async (result, pledge) => {
			const payments = await capturePayments(prop('paymentInfo', pledge))
			const paymentInfoDdb = {
				TableName: TABLE_NAME,
				Item: assoc('paymentInfo', payments, pledge),
			}
			return [...result, paymentInfoDdb]
		}, [], projectPledges)
		// here we can't use batchWrite or transactWrite as those support only
		// 25(batchwrite) or 10(transactWrite) write items
		await Promise.all(map(pledge => documentClient.put(pledge).promise(), pledgesToWrite))
	}

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

	return {
		...projectSerialized,
		status: audit,
	}
}
