/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
import { equals, head, unnest, not, length, gt, last, split, map, compose, omit, prop } from 'ramda'

//keys
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { streamerRejectedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

//lenses
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'

//query utils
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'

//utils
import auditProject from 'root/src/server/api/actions/auditProject'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'
import setAssigneesStatus from 'root/src/server/api/actionUtil/setAssigneesStatus'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'

//email
import dareRejectedByStreamerMail from 'root/src/server/email/templates/dareRejectedByStreamer'
import { dareRejectedByStreamerTitle } from 'root/src/server/email/util/emailTitles'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import sendEmail from 'root/src/server/email/actions/sendEmail'

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
			[TABLE_NAME]: [
				...assigneesToWrite,
				{
					PutRequest: {
						Item: {
							[PARTITION_KEY]: prop('id', projectToReject),
							[SORT_KEY]: head(projectToRejectDdb)[SORT_KEY],
							...setAssigneesStatus(projectToReject, streamerRejectedKey, userTokensStr),
						},
					},
				},
			],
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

	try {
		const emailData = {
			title: dareRejectedByStreamerTitle,
			dareTitle: prop('title', projectToReject),
			dareTitleLink: projectHrefBuilder(prop('id', projectToReject)),
			recipients: [email],
			streamer: prop('displayName', head(userTokens)),
			textFromStreamersReject: message,
		}
		sendEmail(emailData, dareRejectedByStreamerMail)
	} catch (err) {
		console.log('ses error')
	}
	return omit([PARTITION_KEY, SORT_KEY],
		{
			...projectToReject,
			message,
		})
}
