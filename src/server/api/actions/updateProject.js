import { equals, head, pick, prop, split } from 'ramda'

import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import updateDynamoObj from 'root/src/server/api/actionUtil/updateDynamoObj'
import { generalError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import getTimestamp from 'root/src/shared/util/getTimestamp'

/**
 * Updates the project (dare) description
 * @param userId
 * @param payload
 * @returns {Promise<void>}
 */
export default async ({ userId, payload }) => {
	const { projectId, description, title, paymentInfo } = payload

	const [project, assignees] = await dynamoQueryProject(
		userId, projectId,
	)
	// Checks if the descriptions are equal, if so, we avoid a database call
	if (equals(description, project.description)) {
		throw generalError('Project description is the same, please make sure you change it')
	}

	const projectToUpdate = head(project)

	if (!projectToUpdate) {
		throw generalError('Project doesn\'t exist')
	}

	const newUpdate = updateDynamoObj(
		projectId, project, userId,
		description, paymentInfo, null, title,
	)

	// TODO: Check pledge amount
	const updateParams = {
		TableName: TABLE_NAME,
		Item: newUpdate,
	}

	await documentClient.put(updateParams).promise()

	const updateProjectParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: projectToUpdate[PARTITION_KEY],
			[SORT_KEY]: projectToUpdate[SORT_KEY],
		},
		UpdateExpression: 'SET description = :new_description, title = :new_title, modified = :modified',
		ExpressionAttributeValues: {
			':new_description': description,
			':new_title': title,
			':modified': getTimestamp,
		},
	}

	await documentClient.update(updateProjectParams).promise()

	const newProject = projectSerializer([
		...project,
		...assignees,
		...newUpdate,
	])

	const newProjectSerialized = {
		...newProject,
		id: projectId,
		status: prop(1, split('|', projectToUpdate.sk)),
	}

	return {
		userId,
		...newProjectSerialized,
		description,
		title,
	}
}
