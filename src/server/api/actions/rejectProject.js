import { head, prop, length, split, findIndex, propEq, and, assocPath, equals } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { customError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectStreamerRejectedKey, projectAllStreamersRejectedKey } from 'root/src/server/api/lenses'
import getPendingOrAcceptedAssignees from 'root/src/server/api/actionUtil/getPendingOrAcceptedAssignees'
import auditProject from 'root/src/server/api/actions/auditProject'
import rejectProjectByStatus from 'root/src/server/api/actionUtil/rejectProjectByStatus'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewAssigneeId, viewMessage } = payloadLenses


export default async ({ payload }) => {
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
						Item: {
							...projectToReject,
						},
					},
				},
			],
		},
	}

	await documentClient.batchWrite(rejectionParams).promise()

	if (equals(length(assigneesLeft), 0)) {
		const payload = {
			payload: {
				projectId,
				audit: projectAllStreamersRejectedKey,
			},
		}
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
