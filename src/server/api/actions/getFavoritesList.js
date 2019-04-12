import { filter, propEq, split, equals } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_INDEX_NAME, GSI1_PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import { dynamoItemsProp, pkProp, skProp, projectApprovedKey } from 'root/src/server/api/lenses'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import listResults from 'root/src/server/api/actionUtil/listResults'
import favoritesSerializer from 'root/src/server/api/serializers/favoritesSerializer'
import moment from 'moment'

export default async ({ userId }) => {
    const userProjectIdParams = {
        TableName: TABLE_NAME,
        IndexName: GSI1_INDEX_NAME,
        KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
        ExpressionAttributeValues: {
            ':pk': `favorites|${userId}`,
        },
    }

    const dynamoResults = await documentClient.query(
        userProjectIdParams,
    ).promise()

    // Filter `dynamoResults` with the value `favoritesAmount == 1`
    const favoritesProjects = filter(propEq('favoritesAmount', 1), dynamoItemsProp(dynamoResults))

    // check if each project is not rejected or expired
    const filterValidate = async dare => {
        const [project] = await dynamoQueryProject(
            userId, pkProp(dare),
        )

        const diff = moment().diff(project.approved, 'days')
        const [, status] = split('|', skProp(project))

        return equals(status, projectApprovedKey) && diff <= 30
    }

    const availableFavoritesList = filter(filterValidate, favoritesProjects)

    return listResults({
        dynamoResults: { Items: availableFavoritesList },
        serializer: favoritesSerializer,
    })

}
