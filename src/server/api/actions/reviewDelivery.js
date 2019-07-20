/* eslint-disable no-console */
/* eslint-disable max-len */
// libs
import { and, prop, propEq, map, filter, equals, not, startsWith, omit, uniq, concat, compose, reduce } from 'ramda'
import moment from 'moment'
// utils
import archiveProjectRecord from 'root/src/server/api/actionUtil/archiveProjectRecord'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import capturePaymentsWrite from 'root/src/server/api/actionUtil/capturePaymentsWrite'
import captureProjectPledges from 'root/src/server/api/actionUtil/captureProjectPledges'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
// emails
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import videoApprovedEmail from 'root/src/server/email/templates/videoApproved'
import videoDeliveredEmail from 'root/src/server/email/templates/videoDelivered'
import videoRejectedEmail from 'root/src/server/email/templates/videoRejected'
import { videoRejectedTitle, videoApprovedTitle, videoDeliveredTitle } from 'root/src/server/email/util/emailTitles'
// db stuff
import { documentClient, TABLE_NAME, ARCHIVAL_TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectToCapture from 'root/src/server/api/actionUtil/dynamoQueryProjectToCapture'
// descriptions
import { PAYOUT_ASSIGNEES, REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { generalError, payloadSchemaError } from 'root/src/server/api/errors'
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import {
	projectApprovedKey, projectDeliveredKey, projectDeliveryPendingKey,
	projectToCaptureKey, streamerAcceptedKey,
} from 'root/src/shared/descriptions/apiLenses'
// rest
import getPledgersByProjectID from 'root/src/server/api/actionUtil/getPledgersByProjectID'
import getFavoritesByProjectID from 'root/src/server/api/actionUtil/getFavoritesByProjectID'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import setupCronJob from 'root/src/server/api/actionUtil/setupCronJob'

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
				...assigneeDynamoObj(assignee, projectId),
			},
		},
	}), projectAcceptedAssignees), [])

	const [recordToArchive] = filter(project => startsWith(`project|${projectDeliveryPendingKey}`, prop('sk', project)), projectToApproveDdb)
	const [recordToUpdate] = filter(project => startsWith(`project|${projectApprovedKey}`, prop('sk', project)), projectToApproveDdb)

	const projectToArchive = archiveProjectRecord(recordToArchive)

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
		prop('table', projectToArchive),
	]

	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [...assigneesToWrite, ...projectDataToWrite],
			[ARCHIVAL_TABLE_NAME]: [prop('archivalTable', projectToArchive)],
		},
	}
	await documentClient.batchWrite(writeParams).promise()
	try {
		const streamerEmails = await Promise.all(
			map(streamer => getUserEmailByTwitchID(prop('platformId', streamer)),
				projectAcceptedAssignees),
		)

		const emailTitle = equals(audit, projectDeliveredKey) ? videoApprovedTitle : videoRejectedTitle
		const emailTemplate = equals(audit, projectDeliveredKey) ? videoApprovedEmail : videoRejectedEmail

		// Send email for streamers
		sendEmail({
			title: emailTitle,
			dareTitle: prop('title', projectSerialized),
			message,
			dareTitleLink: projectHrefBuilder(prop('id', projectSerialized)),
			recipients: streamerEmails,
			expiryTime: prop('created', projectSerialized),
		}, emailTemplate)

		// Send email for pledgers & favorites
		if (equals(audit, projectDeliveredKey)) {
			const allPledgersAndFavorites = compose(uniq, concat)(
				await getPledgersByProjectID(projectId), await getFavoritesByProjectID(projectId),
			)
			const allPledgersAndFavoritesEmails = await Promise.all(
				map(userId => getUserEmail(userId),
					allPledgersAndFavorites),
			)
			sendEmail({
				title: videoDeliveredTitle,
				dareTitle: prop('title', projectSerialized),
				dareTitleLink: projectHrefBuilder(prop('id', projectSerialized)),
				message,
				recipients: allPledgersAndFavoritesEmails,
				expiryTime: prop('created', projectSerialized),
			}, videoDeliveredEmail)
		}
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
