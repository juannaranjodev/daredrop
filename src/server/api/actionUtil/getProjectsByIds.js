import { map, compose } from 'ramda'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/server/api/lenses'

export default async (idsArr) => {
	const params = map(projectId => ({
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :project)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':project': 'project|',
		},
		ConsistentRead: true,
	}), idsArr)

	const projectsDdb = await Promise.all(map(
		project => documentClient.query(project).promise(), params,
	))

	const projects = map(compose(projectSerializer, dynamoItemsProp), projectsDdb)

	return projects
}
