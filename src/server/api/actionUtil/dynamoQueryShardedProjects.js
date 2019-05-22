import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_PARTITION_KEY, SORT_KEY, PARTITION_KEY, GSI1_INDEX_NAME } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import { map, range, reduce, addIndex } from 'ramda'

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

	// for now we don't really need it, but in future it may be useful
	// const projectDataDdb = await Promise.all(
	// 	map(
	// 		project => documentClient.query({
	// 			TableName: TABLE_NAME,
	// 			KeyConditionExpression: `${PARTITION_KEY} = :pk`,
	// 			ExpressionAttributeValues: {
	// 				':pk': project.pk,
	// 			},
	// 		}).promise(),
	// 		combinedProjects,
	// 	),
	// )

	const assigneesDdb = await Promise.all(
		map(
			project => documentClient.query({
				TableName: TABLE_NAME,
				KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :assignee)`,
				ExpressionAttributeValues: {
					':pk': project.pk,
					':assignee': 'assignee',
				},
			}).promise(),
			combinedProjects,
		),
	)

	const assignees = map(dynamoItemsProp, assigneesDdb)

	// this complex function is to give results same as dynamoQueryProject
	const completeProjects = addIndex(map)(
		(project, idx) => [[project], [...assignees[idx]]],
		combinedProjects,
	)

	return completeProjects
}
