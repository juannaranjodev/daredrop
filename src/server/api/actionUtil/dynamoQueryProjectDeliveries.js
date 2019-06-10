import { projectDeliveryPendingKey, dynamoItemsProp, projectDeliveredKey } from 'root/src/server/api/lenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { ternary } from 'root/src/shared/util/ramdaPlus'

export default async (projectId, delivered) => {
	const projectParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :projectDelivery)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':projectDelivery': `project|${ternary(delivered, projectDeliveredKey, projectDeliveryPendingKey)}|`,
		},
		ConsistentRead: true,
	}
	const deliveriesDdb = await documentClient.query(projectParams).promise()

	return dynamoItemsProp(deliveriesDdb)
}
