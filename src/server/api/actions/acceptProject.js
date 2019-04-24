import { head, not } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectAcceptedKey } from 'root/src/server/api/lenses'

import isOneOfAssigneesSelector from 'root/src/server/api/actionUtil/isOneOfAssigneesSelector'

import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested, viewAssigneeId } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const assigneeId = viewAssigneeId(payload)

	const userTokens = await dynamoQueryOAuth(userId)
	const isOneOfAssignees = isOneOfAssigneesSelector(userTokens, assigneeId)
	if (not(isOneOfAssignees)) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	const [
		projectToAccept,
	] = await dynamoQueryProjectAssignee(
		projectId, assigneeId,
	)

	const projectToConfirm = head(projectToAccept)
	if (!projectToConfirm) {
		throw generalError('Project or assignee doesn\'t exist')
	}
	const acceptationParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							...projectToConfirm,
							amountRequested: viewAmountRequested(payload),
							accepted: projectAcceptedKey,
							created: getTimestamp(),
						},
					},
				},
				{
					PutRequest: {
						Item: {
							projectId: projectToConfirm.pk,
							[SORT_KEY]: `project|${projectAcceptedKey}`,
							[PARTITION_KEY]: `accepted|${assigneeId}`,
							amountRequested: viewAmountRequested(payload),
						},
					},
				},
			],
		},
	}

	await documentClient.batchWrite(acceptationParams).promise()

	const project = projectSerializer([
		...projectToAccept,
	])

	return {
		...project,
		status: projectAcceptedKey,
		amountRequested: viewAmountRequested(payload),
		projectId,
	}
}
