import { map, range, reduce, filter } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import listResults from 'root/src/server/api/actionUtil/listResults'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import moment from 'moment'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'

const PageItemLedngth = 8

export default async (status, payload) => {
	const shardedProjects = await Promise.all(
		map(
			index => documentClient.query({
				TableName: TABLE_NAME,
				IndexName: GSI1_INDEX_NAME,
				KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
				ExpressionAttributeValues: {
					':pk': `project|${status}|${index}`,
				},
			}).promise(),
			range(1, 11),
		),
	)
	// This can be optimized:
	const combinedProjects = reduce(
		(result, projectDdb) => [...result, ...dynamoItemsProp(projectDdb)],
		[],
		shardedProjects,
	)

	// Filter expired projects
	const filterExpired = dare => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= 30
	}
	const filteredProjects = filter(filterExpired, combinedProjects)


	const allPage = filteredProjects.length % PageItemLedngth > 0
		? Math.round(filteredProjects.length / PageItemLedngth) + 1
		: Math.round(filteredProjects.length / PageItemLedngth)

	let { currentPage } = payload.payload
	if (currentPage === undefined) {
		currentPage = 1
	}
	const projects = filteredProjects.slice(
		(currentPage - 1) * PageItemLedngth,
		currentPage * PageItemLedngth,
	)

	return {
		allPage,
		currentPage: payload.currentPage,
		interval: PageItemLedngth,
		...listResults({
			dynamoResults: { Items: map(project => [project], projects) },
			serializer: projectSerializer,
		}),
	}
}
