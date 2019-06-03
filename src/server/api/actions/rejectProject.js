import { equals, head, unnest, not, length, gt, last, split, map, compose, omit, prop } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import { streamerRejectedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'
import auditProject from 'root/src/server/api/actions/auditProject'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import dareRejectedByStreamerMail from 'root/src/server/email/templates/dareRejectedByStreamer'
import { dareRejectedByStreamerTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'


import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewMessage } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const message = viewMessage(payload)

	const [projectToRejectDdb, assigneesDdb] = await dynamoQueryProject(
		null,
		projectId,
	)

	const projectToReject = projectSerializer([
		...projectToRejectDdb,
		...assigneesDdb,
	])
	const userTokens = await dynamoQueryOAuth(userId)
	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToReject)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	if (!projectToReject) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const userAssigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const userAssigneeArr = unnest(unnest(userAssigneeArrNested))

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item: {
				...assignee,
				message,
				accepted: streamerRejectedKey,
				modified: getTimestamp(),
			},
		},
	}), userAssigneeArr)

	const rejectionParams = {
		RequestItems: {
			[TABLE_NAME]: assigneesToWrite,
		},
	}

	const activeAssigneesInProject = getActiveAssignees(assigneesDdb)

	// here also for the future rejection of project needs to be separate action contained here (instead of auditProject) to handle transactWrite properly
	await documentClient.batchWrite(rejectionParams).promise()
	const email = await getUserEmail((prop('creator', projectToReject)))

	if (equals(length(activeAssigneesInProject) - length(userAssigneeArr), 0)) {
		const payload = {
			payload: {
				projectId,
				audit: projectAllStreamersRejectedKey,
			},
		}
		// ^^^^^^^ comment above
		await auditProject(payload)
		await rejectProjectByStatus(projectId, ['favorites', 'pledge'])
	}
	const emailData = {
		title: dareRejectedByStreamerTitle,
		dareTitle: prop('title', projectToReject),
		recipients: [email],
		streamer: prop('displayName', head(userTokens)),
		textFromStreamersReject: message
	}
	sendEmail(emailData, dareRejectedByStreamerMail)



	return omit([PARTITION_KEY, SORT_KEY],
		{
			...projectToReject,
			message,
		})
}
