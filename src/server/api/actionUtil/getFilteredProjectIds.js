import { intersection, prop, map, head, reduce, equals, length } from 'ramda'
import { streamerRejectedKey, dynamoItemsProp } from 'root/src/server/api/lenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'

export default async (items) => {
	if (items == undefined || equals(length(items), 0)) {
		return null
	}
	const filteredResults = await Promise.all(
		map(item => documentClient.query({
			TableName: TABLE_NAME,
			IndexName: GSI1_INDEX_NAME,
			KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
			FilterExpression: 'accepted <> :accepted',
			ExpressionAttributeValues: {
				':pk': `${item.param}|${item.value}`,
				':accepted': streamerRejectedKey,
			},
		}).promise(), items),
	)

	const filteredIds = filteredResult => map(
		item => (
			{ id: prop('pk', item) }
		), dynamoItemsProp(filteredResult),
	)

	const result = reduce(
		(result, filteredResult) => intersection(
			result,
			filteredIds(filteredResult),
		), filteredIds(head(filteredResults)), filteredResults,
	)

	return result
}
