import { prop, concat, compose, propEq, join, length, gt, last, split, omit, map, filter, assoc, tap, __, head } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { streamerAcceptedKey, streamerDeliveryApprovedKey, projectAcceptedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import changeProjectStatus from 'root/src/server/api/actionUtil/changeProjectStatus'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId } = payloadLenses


export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)

	const [projectToApproveDdb, assigneesDdb] = await dynamoQueryProject(null, projectId, projectAcceptedKey)

	const projectAssignees = prop('assignees', projectSerializer([
		...assigneesDdb,
	]))


	const projectAcceptedAssignees = filter(propEq('accepted', streamerAcceptedKey), projectAssignees)

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item: {
				...assigneeDynamoObj({
					...assignee,
					accepted: streamerDeliveryApprovedKey,
				},
				projectId),
			},
		},
	}), projectAcceptedAssignees)


	const projectToWrite = {
		PutRequest: {
			Item: {
				...changeProjectStatus(projectAcceptedKey, projectDeliveredKey, head(projectToApproveDdb)),
			},
		},
	}


	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [...assigneesToWrite, projectToWrite],
		},
	}


	await documentClient.batchWrite(writeParams).promise()

	return {
		...projectSerializer([...projectToApproveDdb, ...assigneesDdb]),
		status: projectDeliveredKey,
	}
}
