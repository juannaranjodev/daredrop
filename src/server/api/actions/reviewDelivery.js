/* eslint-disable no-console */
/* eslint-disable max-len */
// libs
import moment from 'moment'
import { and, equals, filter, map, not, omit, prop, propEq, startsWith } from 'ramda'
// utils
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import setupCronJob from 'root/src/server/api/actionUtil/setupCronJob'
// db stuff
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { generalError, payloadSchemaError } from 'root/src/server/api/errors'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import videoApprovedEmail from 'root/src/server/email/templates/videoApproved'
import videoRejectedEmail from 'root/src/server/email/templates/videoRejected'
import { videoApprovedTitle, videoRejectedTitle } from 'root/src/server/email/util/emailTitles'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { projectApprovedKey, projectDeliveredKey, projectDeliveryPendingKey, projectToCaptureKey, streamerAcceptedKey, streamerDeliveryApprovedKey } from 'root/src/shared/descriptions/apiLenses'
import { PAYOUT_ASSIGNEES, REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { ternary } from 'root/src/shared/util/ramdaPlus'
// rest

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
					accepted: streamerDeliveryApprovedKey,
					deliveryVideo: projectDeliveredKey,
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

	try {
		const streamerEmails = await Promise.all(
			map(streamer => getUserEmailByTwitchID(prop('platformId', streamer)),
				projectAcceptedAssignees),
		)
		const emailTitle = equals(audit, projectDeliveredKey) ? videoApprovedTitle : videoRejectedTitle
		const emailTemplate = equals(audit, projectDeliveredKey) ? videoApprovedEmail : videoRejectedEmail

		await documentClient.batchWrite(writeParams).promise()
		map((streamerEmail) => {
			const emailData = {
				title: emailTitle,
				dareTitle: prop('title', projectSerialized),
				message,
				recipients: [streamerEmail],
				expiryTime: prop('created', projectSerialized),
			}
			sendEmail(emailData, emailTemplate)
		}, streamerEmails)
	} catch (err) {
		console.log('ses error')
	}
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
		const eventDate = moment().add(5, 'days')
		try {
			await setupCronJob(
				{
					endpointId: PAYOUT_ASSIGNEES,
					payload: { projectId },
				},
				eventDate, 'projectId',
			)
		} catch (err) {
			return err
		}
	}

	return omit(['assignees'], {
		...projectSerialized,
		status: audit,
	})
}
