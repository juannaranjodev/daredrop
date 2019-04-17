import { filter, propEq, split, equals, addIndex, map, nth, head, last } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_INDEX_NAME, GSI1_PARTITION_KEY, PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, pkProp, skProp, projectApprovedKey } from 'root/src/server/api/lenses'
import listResults from 'root/src/server/api/actionUtil/listResults'
import favoritesSerializer from 'root/src/server/api/serializers/favoritesSerializer'
import moment from 'moment'

const PageItemLedngth = 8

export default async ({ userId, payload }) => {
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
    const filterValidate = async (dare) => {
        const projectParams = {
            TableName: TABLE_NAME,
            KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :project)`,
            ExpressionAttributeValues: {
                ':pk': pkProp(dare),
                ':project': 'project',
            },
            ConsistentRead: true,
        }

        const projectDdb = await documentClient.query(
            projectParams,
        ).promise()

        const project = dynamoItemsProp(projectDdb)

        const diff = moment().diff(head(project).approved, 'days')
        const [, status] = split('|', head(project).sk)

        return equals(status, projectApprovedKey) && diff <= 30

    }

    const availableArray = await Promise.all(
        map(filterValidate, favoritesProjects)
    )

    const mapIndexed = addIndex(map)
    const availableIndexArray = mapIndexed((val, idx) => val ? idx : 99999, availableArray)
    const resultArray = map(index => index == 99999 ? null : nth(index, favoritesProjects), availableIndexArray)

    const availableFavoritesList = resultArray.filter(function (x) {
        return (x !== null);
    })

    const allPage = availableFavoritesList.length % PageItemLedngth > 0
        ? Math.round(availableFavoritesList.length / PageItemLedngth) + 1
        : Math.round(availableFavoritesList.length / PageItemLedngth)

    let { currentPage } = payload
    if (currentPage === undefined) {
        currentPage = 1
    }
    const projects = availableFavoritesList.slice(
        (currentPage - 1) * PageItemLedngth,
        currentPage * PageItemLedngth,
    )

    return {
        allPage,
        currentPage: payload.currentPage,
        interval: PageItemLedngth,
        ...listResults({
            dynamoResults: { Items: projects },
            serializer: favoritesSerializer,
        }),
    }

    // return listResults({
    //     dynamoResults: { Items: availableFavoritesList },
    //     serializer: favoritesSerializer,
    // })

}