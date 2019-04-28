import { head, unnest, not, length, gt, last, split, _, map, compose } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import { projectAcceptedKey } from 'root/src/server/api/lenses'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import splitAssigneeId from 'root/src/server/api/actionUtil/splitAssigneeId'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import setProjectAssigneesStatus from 'root/src/server/api/actionUtil/setProjectAssigneesStatus'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const userTokens = await dynamoQueryOAuth(userId)
	const amountRequested = viewAmountRequested(payload)

	const [
		projectToAccept,
	] = await dynamoQueryProject(
		null,
		projectId,
	)

	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToAccept)
	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	const projectToConfirm = head(projectToAccept)
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

	const project = setProjectAssigneesStatus(userTokensObj, projectToConfirm, projectAcceptedKey)

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item: {
				...assignee,
				amountRequested,
				accepted: projectAcceptedKey,
				modified: getTimestamp(),
			},
		},
	}), assigneeArr)

	const acceptationParams = {
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

	await documentClient.batchWrite(acceptationParams).promise()

	return project
}
