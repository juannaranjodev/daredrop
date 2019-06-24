import { map } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

export default async () => {
	// this one is for DB cleanup after testing
	const params = {
		TableName: TABLE_NAME,
		ProjectionExpression: '#pk, #sk',
		FilterExpression: 'begins_with(#pk, :prj)',
		ExpressionAttributeNames: {
			'#pk': 'pk',
			'#sk': 'sk',
		},
		ExpressionAttributeValues: {
			':prj': 'project-',
		},
	}
	const response = await documentClient.scan(params).promise()
	const dynamoItems = response.Items

	const dynamoDeleteExpression = map(item => ({
		Key: {
			[PARTITION_KEY]: item[PARTITION_KEY],
			[SORT_KEY]: item[SORT_KEY],
		},
		TableName: TABLE_NAME,
	}), dynamoItems)

	const res = await Promise.all(map(i => documentClient.delete(i).promise(), dynamoDeleteExpression))

	return res
}
