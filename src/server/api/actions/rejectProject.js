import { head, prop, view } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { customError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectStreamerRejectedKey } from 'root/src/server/api/lenses'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(REJECT_PROJECT)
const { viewProjectId, viewAssigneeId, viewMessage } = payloadLenses

const payload = {
	assigneeId: 'twitch|246426163',
	projectId: 'project-1a2833e0-6149-11e9-b5ff-b726b53f4d13',
}

export default (async (/* { payload } */) => {
	const projectId = viewProjectId(payload)
	const assigneeId = viewAssigneeId(payload)
	const message = viewMessage(payload)

	const [projectAssignee] = await dynamoQueryProjectAssignee(projectId, assigneeId)

	const [project] = head(await dynamoQueryProject(null, projectId))
	// console.log(prop('assignees', project))
	const projectToReject = head(projectAssignee)
	// console.log(projectToReject)
	if (!projectToReject) {
		return customError(404, { error: 'Project or assignee doesn\'t exist' })
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
		projectToReject,
	])

	return {
		...projectToReturn,
		status: projectStreamerRejectedKey,
		message,
	}
})()
