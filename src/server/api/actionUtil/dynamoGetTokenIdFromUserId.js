import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { head, prop, replace, equals } from 'ramda'

export default async (userId, token) => {
	const tokenParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :token)`,
		ExpressionAttributeValues: {
			':pk': `${userId}`,
			':token': `token-${token}|`,
		},
	}

	const dynamoResult = await documentClient.query(tokenParams).promise()
	if (equals(prop('Count', dynamoResult), 0)) return ''
	return replace(`token-${token}|`, '', prop('sk', head(dynamoItemsProp(dynamoResult))))
}
