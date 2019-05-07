import { projectDeliveryPendingKey, dynamoItemsProp } from 'root/src/server/api/lenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default async (projectId) => {
	const projectParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :projectDelivery)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':projectDelivery': `project|${projectDeliveryPendingKey}|`,
		},
		ConsistentRead: true,
	}
	const deliveriesDdb = await documentClient.query(projectParams).promise()

	return dynamoItemsProp(deliveriesDdb)
}
