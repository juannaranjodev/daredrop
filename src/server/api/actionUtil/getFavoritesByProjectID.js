import { reduce, compose, prop } from 'ramda'
import { splitAndGetLast } from 'root/src/shared/util/ramdaPlus'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'

export default async (projectId) => {
	const favoriteProjectsDdb = await documentClient.query({
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :sk)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':sk': 'favorites|',
		},
	}).promise()
	const favoriteProjects = dynamoItemsProp(favoriteProjectsDdb)
	const favorite = reduce((result, pledgedProject) => [...result, compose(splitAndGetLast('|'), prop('sk'))(pledgedProject)],
		[], favoriteProjects)
	return favorite
}
