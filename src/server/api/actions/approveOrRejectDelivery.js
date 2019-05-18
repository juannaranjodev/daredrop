import { prop, propEq, map, filter, equals, and, not } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { APPROVE_OR_REJECT_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { streamerAcceptedKey, streamerDeliveryApprovedKey, streamerDeliveryRejectedKey, projectDeliveredKey } from 'root/src/server/api/lenses'
import assigneeDynamoObj from 'root/src/server/api/actionUtil/assigneeDynamoObj'
import archiveProject from 'root/src/server/api/actionUtil/archiveProject'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { payloadSchemaError } from 'root/src/server/api/errors'

const payloadLenses = getPayloadLenses(APPROVE_OR_REJECT_DELIVERY)
const { viewProjectId, viewAudit, viewMessage } = payloadLenses


export default async ({ payload }) => {
	const projectId = viewProjectId(payload)
	const audit = viewAudit(payload)
	const message = viewMessage(payload)

	if (and(not(equals(audit, projectDeliveredKey)), not(message))) {
		throw payloadSchemaError('Message is required')
	}

	const [projectToApproveDdb, assigneesDdb] = await dynamoQueryProject(null, projectId)

	const projectSerialized = projectSerializer([...projectToApproveDdb, ...assigneesDdb])

	const projectAssignees = prop('assignees', projectSerializer([
		...assigneesDdb,
	]))

	const projectAcceptedAssignees = filter(propEq('accepted', streamerAcceptedKey), projectAssignees)

	const assigneesToWrite = ternary(equals(audit, projectDeliveredKey), map(assignee => ({
		PutRequest: {
			Item: {
				...assigneeDynamoObj({
					...assignee,
					accepted: ternary(equals(audit, projectDeliveredKey),
						streamerDeliveryApprovedKey, prop('accepted', assignee)),
				},
				projectId),
			},
		},
	}), projectAcceptedAssignees), [])

	const projectDataToArchive = ternary(equals(audit, projectDeliveredKey),
		archiveProject(projectToApproveDdb), [])

	const projectDelivered = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: prop('id', projectSerialized),
				[SORT_KEY]: await generateUniqueSortKey(prop('id', projectSerialized), `project|${audit}`, 1, 10),
				created: getTimestamp(),
				message,
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
		status: audit,
	}
}
