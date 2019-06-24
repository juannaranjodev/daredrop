import { documentClient } from 'root/src/server/api/dynamoClient'
import { map } from 'ramda'

export default async () => {
	const sourceTableName = process.env.API_DYNAMO_DB_TABLE
	const targetTableName = process.env.PERFORMANCE_TEST_DYNAMODB_TABLE
	const params = {
		TableName: sourceTableName,
	}

	const scanResults = []
	let items
	do {
		items = await documentClient.scan(params).promise()
		items.Items.forEach(item => scanResults.push(item))
		params.ExclusiveStartKey = items.LastEvaluatedKey
	} while (typeof items.LastEvaluatedKey !== 'undefined')

	const targetParams = map(Item => ({
		Item,
		TableName: targetTableName,
	}), scanResults)

	await Promise.all(map(item => documentClient.put(item).promise(), targetParams))
	return 'success'
}
