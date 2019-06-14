import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { map, reduce, range } from 'ramda'
import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectAcceptedKey } from 'root/src/shared/descriptions/apiLenses'

export default async () => {
	const dynamoResults = await Promise.all(
		map(index => documentClient.query({
			TableName: TABLE_NAME,
			IndexName: GSI1_INDEX_NAME,
			KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
			ExpressionAttributeValues: {
				':pk': `project|${projectAcceptedKey}|${index}`,
			},
		}).promise(), range(1, 11)),
	)


	const items = reduce(
		(result, projectDdb) => {
			const [project] = dynamoItemsProp(projectDdb)
			if (project) {
				return [...result, { id: project.pk, accepted: project.created }]
			}
			return result
		},
		[],
		dynamoResults,
	)

	return { items }
}
