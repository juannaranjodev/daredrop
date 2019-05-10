import { intersection, reduce,prop } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import {
    GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import listResults from 'root/src/server/api/actionUtil/listResults'
import filteredProjectSerializer from 'root/src/server/api/serializers/filteredProjectSerializer'

export default async (items) => {

    if (items == undefined || items.length == 0) return null
    const filterByParam = async (param, value) => {
        const filteredProjectIdParams = {
            TableName: TABLE_NAME,
            IndexName: GSI1_INDEX_NAME,
            KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
            ExpressionAttributeValues: {
                ':pk': `${param}|${value}`,
            },
        }
        const dynamoResults = await documentClient.query(
            filteredProjectIdParams,
        ).promise()
        return prop("items",listResults({
            dynamoResults,
            serializer: filteredProjectSerializer,
        }))
    }

    let result = null
    for (const item of items) {
        if (result == null) {
            result = await filterByParam(item.param, item.value)
        }
        else {
            result = intersection(result, await filterByParam(item.param, item.value))
        }
    }
    return result
}
