import { prop, propEq, map, filter } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { streamerAcceptedKey, streamerDeliveryApprovedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import archiveProject from 'root/src/server/api/actionUtil/archiveProject'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId } = payloadLenses


export default async ({ payload }) => {
	const projectId = viewProjectId(payload)

	const [projectToApproveDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const projectSerialized = projectSerializer([...projectToApproveDdb, ...assigneesDdb])

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

	const projectDataToArchive = archiveProject(projectToApproveDdb)

	const projectDelivered = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: prop('id', projectSerialized),
				[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `project|${projectDeliveredKey}`, 1, 10),
				created: getTimestamp(),
			},
		},
	}

	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [...assigneesToWrite, ...projectDataToArchive, projectDelivered],
		},
	}

	await documentClient.batchWrite(writeParams).promise()

	return {
		...projectSerialized,
		status: projectDeliveredKey,
	}
}
