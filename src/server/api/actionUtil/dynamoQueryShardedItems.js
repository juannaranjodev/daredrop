import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_PARTITION_KEY, GSI1_INDEX_NAME } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { map, range, reduce } from 'ramda'

export default async (itemSk) => {
	const shardedItems = await Promise.all(
		map(
			index => documentClient.query({
				TableName: TABLE_NAME,
				IndexName: GSI1_INDEX_NAME,
				KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
				ExpressionAttributeValues: {
					':pk': `${itemSk}|${index}`,
				},
			}).promise(),
			range(1, 11),
		),
	)

	const combinedItems = reduce(
		(result, itemDdb) => [...result, ...dynamoItemsProp(itemDdb)],
		[],
		shardedItems,
	)

	return combinedItems
}
