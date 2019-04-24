import { head, prop, length, split, findIndex, propEq, and, assocPath, equals, not } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { customError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectStreamerRejectedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import getPendingOrAcceptedAssignees from 'root/src/server/api/actionUtil/getPendingOrAcceptedAssignees'
import auditProject from 'root/src/server/api/actions/auditProject'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'

import isOneOfAssigneesSelector from 'root/src/server/api/actionUtil/isOneOfAssigneesSelector'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewAssigneeId, viewMessage } = payloadLenses


export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const assigneeId = viewAssigneeId(payload)
	const message = viewMessage(payload)

	const [projectAssignee] = await dynamoQueryProjectAssignee(projectId, assigneeId)

	const [project] = head(await dynamoQueryProject(null, projectId))
	const [platform, platformId] = split('|', assigneeId)
	const projectAssignees = prop('assignees', project)
	const assigneeIndex = findIndex(and(propEq('platform', platform), propEq('platformId', platformId)))(projectAssignees)
	const projectToReject = assocPath(['assignees', assigneeIndex, 'accepted'], projectStreamerRejectedKey, project)

	const assigneesLeft = getPendingOrAcceptedAssignees(projectToReject)

	const assigneeToReject = head(projectAssignee)

	if (!assigneeToReject) {
		return customError(404, { error: 'Project or assignee doesn\'t exist' })
	}

	const userTokens = await dynamoQueryOAuth(userId)
	const isOneOfAssignees = isOneOfAssigneesSelector(userTokens, assigneeId)

	if (not(isOneOfAssignees)) {
		throw authorizationError('Assignee is not listed on this dare')
	}


	if (assigneeToReject.amountRequested) {
		delete assigneeToReject.amountRequested
	}

	const rejectionParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							...assigneeToReject,
							accepted: projectStreamerRejectedKey,
							message,
							created: getTimestamp(),
						},
					},
				},
				{
					PutRequest: {
						Item: projectToReject,
					},
				},
			],
		},
	}

	// here also for the future rejection of project needs to be separate action to handle transactWrite properly
	await documentClient.batchWrite(rejectionParams).promise()

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

	const projectToReturn = projectSerializer([
		assigneeToReject,
	])

	return {
		...projectToReturn,
		status: projectStreamerRejectedKey,
		message,
	}
}
