import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { map, addIndex, assoc, unnest, compose } from 'ramda'
import moment from 'moment'

export default async (projectIdArr) => {
	const projectsToModify = await Promise.all(
		map(
			projectId => documentClient.query({
				TableName: TABLE_NAME,
				KeyConditionExpression: `${PARTITION_KEY} = :pk`,
				ExpressionAttributeValues: {
					':pk': projectId,
				},
			}).promise(),
			projectIdArr,
		),
	)
	const projects = map(dynamoItemsProp, projectsToModify)
	const projectsToWrite = unnest(addIndex(map)((item, idx) => map(
		compose(assoc('created', moment().add(idx, 'days').format()), assoc('approved', moment().add(idx, 'days').format())),
		item,
	), projects))

	const projectsToWriteDdb = map(Item => ({
		TableName: [TABLE_NAME],
		Item,
	}), projectsToWrite)


	await Promise.all(map(project => documentClient.put(project).promise(), projectsToWriteDdb))
}
