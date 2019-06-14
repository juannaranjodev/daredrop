import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { head } from 'ramda'

export default async (projectId, userId) => {
	const queryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :sk`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':sk': `favorites|${userId}`,
		},
		ConsistentRead: true,
	}
	const favoritesObj = await documentClient.query(queryParams).promise()
	return head(dynamoItemsProp(favoritesObj))
}
