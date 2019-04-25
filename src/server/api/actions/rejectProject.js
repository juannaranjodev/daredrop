import { head, not } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectStreamerRejectedKey } from 'root/src/server/api/lenses'

import isOneOfAssigneesSelector from 'root/src/server/api/actionUtil/isOneOfAssigneesSelector'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewAssigneeId, viewMessage } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const assigneeId = viewAssigneeId(payload)
	const message = viewMessage(payload)

	const userTokens = await dynamoQueryOAuth(userId)
	const isOneOfAssignees = isOneOfAssigneesSelector(userTokens, assigneeId)

	if (not(isOneOfAssignees)) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	const [
		project,
	] = await dynamoQueryProjectAssignee(
		projectId, assigneeId,
	)
	const projectToReject = head(project)
	if (!projectToReject) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	if (projectToReject.amountRequested) {
		delete projectToReject.amountRequested
	}

	const rejectionParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							...projectToReject,
							accepted: projectStreamerRejectedKey,
							message,
							created: getTimestamp(),
						},
					},
				},
			],
		},
	}

	await documentClient.batchWrite(rejectionParams).promise()
	const projectToReturn = projectSerializer([
		...projectToReject,
	])

	return {
		...projectToReturn,
		status: projectStreamerRejectedKey,
		message,
	}
}
