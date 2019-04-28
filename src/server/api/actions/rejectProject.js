import { head, unnest, not, length, gt, last, split, map, compose } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import { projectStreamerRejectedKey } from 'root/src/server/api/lenses'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import splitAssigneeId from 'root/src/server/api/actionUtil/splitAssigneeId'
import setProjectAssigneesStatus from 'root/src/server/api/actionUtil/setProjectAssigneesStatus'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewMessage } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const message = viewMessage(payload)
	const userTokens = await dynamoQueryOAuth(userId)

	const [
		projectToReject,
	] = await dynamoQueryProject(
		null,
		projectId,
	)

	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToReject)
	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	const projectToConfirm = head(projectToReject)
	if (!projectToConfirm) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const userTokensObj = map(splitAssigneeId, userTokensInProject)
	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const assigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const assigneeArr = unnest(unnest(assigneeArrNested))

	const project = setProjectAssigneesStatus(userTokensObj, projectToConfirm, projectStreamerRejectedKey)

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

	await documentClient.batchWrite(rejectionParams).promise()

	return {
		project,
		message,
	}
}
