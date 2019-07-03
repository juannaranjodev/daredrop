/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
import { intersection, prop, map, reduce, equals, length, addIndex, join, assoc, __ } from 'ramda'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { streamerRejectedKey, dynamoItemsProp } from 'root/src/server/api/lenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import dynamoQueryShardedItems from 'root/src/server/api/actionUtil/dynamoQueryShardedItems'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'

export default async (items) => {
	if (!items || equals(length(items), 0)) {
		return null
	}
	const makePk = item => join('|', [prop('param', item), prop('value', item)])
	const filteredResults = await Promise.all(
		map(async (item) => {
			let items
			switch (prop('param', item)) {
				case 'assignee':
					items = await documentClient.query({
						TableName: TABLE_NAME,
						IndexName: GSI1_INDEX_NAME,
						KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
						FilterExpression: 'accepted <> :accepted',
						ExpressionAttributeValues: {
							':pk': makePk(item),
							':accepted': streamerRejectedKey,
						},
					}).promise()
					return dynamoItemsProp(items)
				case 'game':
					items = await documentClient.query({
						TableName: TABLE_NAME,
						IndexName: GSI1_INDEX_NAME,
						KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
						ExpressionAttributeValues: {
							':pk': makePk(item),
						},
					}).promise()
					return dynamoItemsProp(items)
				case 'project':
					return dynamoQueryShardedItems(makePk(item))
				case 'pledge':
				case 'favorites':
					items = await documentClient.query({
						TableName: TABLE_NAME,
						IndexName: GSI1_INDEX_NAME,
						KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
						ExpressionAttributeValues: {
							':pk': makePk(item),
						},
					}).promise()
					return dynamoItemsProp(items)
				default:
					return []
			}
		}, items),
	)

	const filteredIdsArrays = map(map(item => assoc('id', prop('pk', item), {})), filteredResults)
	return addIndex(reduce)((acc, item, idx) => ternary(
		equals(idx, 0),
		item, intersection(item, acc),
	), [], filteredIdsArrays)
}
