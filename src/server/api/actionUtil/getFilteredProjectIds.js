import { intersection, prop, map, forEach, reduce } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import {
    GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'

export default async (items) => {
    if (items == undefined || items.length == 0) {
        return null
    }
    const filteredResults = await Promise.all(
        map((item) => {
            return documentClient.query({
                TableName: TABLE_NAME,
                IndexName: GSI1_INDEX_NAME,
                KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
                ExpressionAttributeValues: {
                    ':pk': `${item.param}|${item.value}`,
                }
            }
            ).promise()
        }, items)
    )
    const filteredIds = (filteredResult) => map(
        (item) => (
            {"id": prop('pk', item)}
        ), dynamoItemsProp(filteredResult)
    )

    const result = reduce(
        (result, filteredResult) => {
            return intersection(
                    result,
                    filteredIds(filteredResult)
                )
        }, filteredIds(filteredResults[0]), filteredResults
    )
    return result
}
