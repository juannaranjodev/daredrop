import { reduce, compose, prop } from 'ramda'
import { splitAndGetLast } from 'root/src/shared/util/ramdaPlus'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'

export default async (projectId) => {
	const pledgedProjectsDdb = await documentClient.query({
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :sk)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':sk': 'pledge|',
		},
	}).promise()
	const pledgedProjects = dynamoItemsProp(pledgedProjectsDdb)
	const pledgers = reduce((result, pledgedProject) => [...result, compose(splitAndGetLast('|'), prop('sk'))(pledgedProject)],
		[], pledgedProjects)
	return pledgers
}
