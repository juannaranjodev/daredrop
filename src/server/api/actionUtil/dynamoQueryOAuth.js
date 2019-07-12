import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'

export default async (userId) => {
	const oAuthParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :token)`,
		ExpressionAttributeValues: {
			':pk': userId,
			':token': 'token',
		},
		ConsistentRead: true,
	}

	const [oAuthDb] = await Promise.all([
		documentClient.query(oAuthParams).promise(),
	])

	return dynamoItemsProp(oAuthDb)
}
