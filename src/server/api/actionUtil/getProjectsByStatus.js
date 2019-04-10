import { map, range, reduce, filter, isNil  } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import listResults from 'root/src/server/api/actionUtil/listResults'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import moment from 'moment'

import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY, GSI1_SORT_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'

const PageItemLedngth = 8

export default async (status, payload, userId) => {
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
	let combinedProjects = reduce(
		(result, projectDdb) => [...result, ...dynamoItemsProp(projectDdb)],
		[],
		shardedProjects,
	)
	if (userId) {
		const sharedPledge = await Promise.all(
			map(
				project => documentClient.query({
					TableName: TABLE_NAME,
					KeyConditionExpression: `${GSI1_SORT_KEY} = :pk and ${GSI1_PARTITION_KEY} = :pledgeUserId`,
					ExpressionAttributeValues: {
						':pk': project.pk,
						':pledgeUserId': `pledge|${userId}`,
					},
					ConsistentRead: true,
				}).promise(),
				combinedProjects,
			),
		)

	// Filter expired projects
	const filterExpired = dare => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= 30
	}
	const filteredProjects = filter(filterExpired, combinedProjects)

		const resultProject = map(
			index => merge(
				filteredProjects[index],
				{ Pledged: sharedPledge[index].Count > 0 },
			),
			range(0, filteredProjects.length),
		)
		filteredProjects = resultProject
	}

	const allPage = filteredProjects.length % PageItemLedngth > 0
		? Math.round(filteredProjects.length / PageItemLedngth) + 1
		: Math.round(filteredProjects.length / PageItemLedngth)

	let { currentPage } = payload
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
