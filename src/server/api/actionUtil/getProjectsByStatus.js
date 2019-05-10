import { sort, map, range, reduce, filter,contains } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import listResults from 'root/src/server/api/actionUtil/listResults'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import {SORT_BY_BOUNTY,SORT_BY_TIME_LEFT,SORT_BY_NEWEST,SORT_BY_ACCEPTED} from 'root/src/shared/constants/sortTypesOfProject'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'

const PageItemLength = 8

export default async (status, sortKey, payload, filteredProjectsByGameAndStreamer) => {
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
	const combinedProjects = reduce(
		(result, projectDdb) => [...result, ...dynamoItemsProp(projectDdb)],
		[],
		shardedProjects,
	)

	// Filter expired projects
	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}

	const filterByGameAndStreamer = (dare) =>{
		return contains({"id":dare.pk}, filteredProjectsByGameAndStreamer.items)
	}

	let filteredProjects = filter(filterExpired, combinedProjects)

	if (filteredProjectsByGameAndStreamer != null){
		filteredProjects = filter(filterByGameAndStreamer,filteredProjects)
	}

	const sortedProjects = sort(sortKey, filteredProjects)

	const allPage = sortedProjects.length % PageItemLength > 0
		? Math.round(sortedProjects.length / PageItemLength) + 1
		: Math.round(sortedProjects.length / PageItemLength)

	let { currentPage } = payload.payload
	if (currentPage === undefined) {
		currentPage = 1
	}
	const projects = sortedProjects.slice(
		(currentPage - 1) * PageItemLength,
		currentPage * PageItemLength,
	)

	return {
		allPage,
		currentPage: payload.currentPage,
		interval: PageItemLength,
		...listResults({
			dynamoResults: { Items: map(project => [project], projects) },
			serializer: projectSerializer,
		}),
	}
}
