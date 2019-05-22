
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_PARTITION_KEY, PARTITION_KEY, GSI1_INDEX_NAME } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import { map, range, reduce } from 'ramda'

export default async (projectStatus) => {
	const shardedProjects = await Promise.all(
		map(
			index => documentClient.query({
				TableName: TABLE_NAME,
				IndexName: GSI1_INDEX_NAME,
				KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
				ExpressionAttributeValues: {
					':pk': `project|${projectStatus}|${index}`,
				},
			}).promise(),
			range(1, 11),
		),
	)

	const combinedProjects = reduce(
		(result, projectDdb) => [...result, ...dynamoItemsProp(projectDdb)],
		[],
		shardedProjects,
	)

	const projectDataDdb = await Promise.all(
		map(
			project => documentClient.query({
				TableName: TABLE_NAME,
				KeyConditionExpression: `${PARTITION_KEY} = :pk`,
				ExpressionAttributeValues: {
					':pk': project.pk,
				},
			}).promise(),
			combinedProjects,
		),
	)

	return map(dynamoItemsProp, projectDataDdb)
}
