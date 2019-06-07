import { prop, propEq, map, filter, equals, and, not, startsWith } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import {
	streamerAcceptedKey, streamerDeliveryApprovedKey,
	projectDeliveredKey, projectDeliveryPendingKey,
	projectApprovedKey, projectToCaptureKey,
} from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { ternary, orNull } from 'root/src/shared/util/ramdaPlus'
import { payloadSchemaError } from 'root/src/server/api/errors'
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'


import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import {videoRejectedTitle, videoApprovedTitle} from 'root/src/server/email/util/emailTitles'
import videoApprovedEmail from 'root/src/server/email/templates/videoApproved'
import videoRejectedEmail from 'root/src/server/email/templates/videoRejected'
import videoDeliveredEmail from 'root/src/server/email/templates/videoDelivered'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import { equal } from 'assert';
import { projectAcceptedKey } from '../lenses';

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
	const streamerEmails = await Promise.all(
		map( streamer => getUserEmailByTwitchID(prop('platformId',streamer))
		, projectAcceptedAssignees)
	)

	const emailTitle = equals(audit, projectDeliveredKey) ? videoApprovedTitle : videoRejectedTitle
	const emailTemplate = equals(audit, projectDeliveredKey) ? videoApprovedEmail : videoRejectedEmail
	await documentClient.batchWrite(writeParams).promise()
	map( streamerEmail => {
		const emailData = {
			title : emailTitle,
			dareTitle : prop('title', projectSerialized),
			message : message,
			recipients: [streamerEmail],
			expiryTime : prop('created', projectSerialized)
		}
		sendEmail(emailData, emailTemplate)
	}, streamerEmails)

	return {
		...projectSerialized,
		status: audit,
	}
}
