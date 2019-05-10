import { sort, map, range, reduce, filter,contains,prop } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import listResults from 'root/src/server/api/actionUtil/listResults'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'

import { sortByType } from 'root/src/server/api/actionUtil/sortUtil'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'

import getFilteredProjectIds from 'root/src/server/api/actionUtil/getFilteredProjectIds'

const PageItemLength = 8

export default async (status,sortType,payload) => {
	const realPayload = payload.payload
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
	let filteredProjects = filter(filterExpired, combinedProjects)

	//Start Filter with filter items
	const filteredProjectIds = await getFilteredProjectIds(prop("filter", realPayload))
	const filterByIds = (dare) =>{
		return contains({"id":dare.pk}, filteredProjectIds)
	}

	if (filteredProjectIds != null){
		filteredProjects = filter(filterByIds,filteredProjects)
	}
	//End Filter with filter items

	const diffBySortType = prop(realPayload.sortType, sortByType) ?
		prop(realPayload.sortType, sortByType) : prop(sortType, sortByType)
	const sortedProjects = sort(diffBySortType, filteredProjects)
	const allPage = sortedProjects.length % PageItemLength > 0
		? Math.round(sortedProjects.length / PageItemLength) + 1
		: Math.round(sortedProjects.length / PageItemLength)

	let { currentPage } = realPayload
	if (currentPage === undefined) {
		currentPage = 1
	}
	const projects = sortedProjects.slice(
		(currentPage - 1) * PageItemLength,
		currentPage * PageItemLength,
	)

	return {
		allPage,
		currentPage: realPayload.currentPage,
		interval: PageItemLength,
		...listResults({
			dynamoResults: { Items: map(project => [project], projects) },
			serializer: projectSerializer,
		}),
	}
}
