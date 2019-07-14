import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default async (projectId) => {
	const projectPledgeParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :pledge)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':pledge': 'pledge|',
		},
		ConsistentRead: true,
	}
	const projectPledgesDdb = await documentClient.query(projectPledgeParams).promise()

	return dynamoItemsProp(projectPledgesDdb)
}
