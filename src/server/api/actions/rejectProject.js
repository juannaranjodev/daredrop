import { equals, head, unnest, not, length, gt, last, split, map, compose } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import splitAssigneeId from 'root/src/server/api/actionUtil/splitAssigneeId'
import setProjectAssigneesStatus from 'root/src/server/api/actionUtil/setProjectAssigneesStatus'
import { projectStreamerRejectedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import getPendingOrAcceptedAssignees from 'root/src/server/api/actionUtil/getPendingOrAcceptedAssignees'
import auditProject from 'root/src/server/api/actions/auditProject'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewMessage } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const message = viewMessage(payload)
	const [projectToReject] = head(await dynamoQueryProject(null, projectId))

	const userTokens = await dynamoQueryOAuth(userId)

	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToReject)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	if (!projectToReject) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const userTokensObj = map(splitAssigneeId, userTokensInProject)
	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const assigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const assigneeArr = unnest(unnest(assigneeArrNested))

	const project = setProjectAssigneesStatus(userTokensObj, projectToReject, projectStreamerRejectedKey)

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item: {
				...assignee,
				accepted: projectStreamerRejectedKey,
				message,
				modified: getTimestamp(),
			},
		},
	}), assigneeArr)

	const rejectionParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: project,
					},
				},
				...assigneesToWrite,
			],
		},
	}

	// here also for the future rejection of project needs to be separate action contained here (instead of auditProject) to handle transactWrite properly
	await documentClient.batchWrite(rejectionParams).promise()

	const assigneesLeft = getPendingOrAcceptedAssignees(project)

	if (equals(length(assigneesLeft), 0)) {
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

	return {
		project,
		message,
	}
}
