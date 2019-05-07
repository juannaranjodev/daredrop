import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'

export default async (projectId) => {
	const projectParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :assignee)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':assignee': 'assignee|',
		},
		ConsistentRead: true,
	}
	const [assigneesDdb] = await Promise.all([
		documentClient.query(projectParams).promise(),
	])

	return dynamoItemsProp(assigneesDdb)
}
