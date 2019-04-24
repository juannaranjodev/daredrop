import { uniq, prop, sort, filter, map } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import myProjectsSerializer from 'root/src/server/api/serializers/myProjectsSerializer'
import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import { descendingCreated } from 'root/src/server/api/actionUtil/sortUtil'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import getProjectsByIds from 'root/src/server/api/actionUtil/getProjectsByIds'

const PageItemLedngth = 8

export default async ({ userId, payload }) => {
	const pledgedProjectsDdb = await documentClient.query({
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
		ExpressionAttributeValues: {
			':pk': `pledge|${userId}`,
		},
	}).promise()

	const favoritesProjectsDdb = await documentClient.query({
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
		ExpressionAttributeValues: {
			':pk': `favorites|${userId}`,
		},
	}).promise()

	const pledgedProjects = dynamoItemsProp(pledgedProjectsDdb)
	const favoritesProjects = dynamoItemsProp(favoritesProjectsDdb)

	const myProjectsIdsArr = uniq(map(prop('pk'), [...pledgedProjects, ...favoritesProjects]))

	const myProjects = await getProjectsByIds(myProjectsIdsArr)

	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}
	const filteredProjects = filter(filterExpired, myProjects)

	const sortedProjects = sort(descendingCreated, filteredProjects)

	const allPage = sortedProjects.length % PageItemLedngth > 0
		? Math.round(sortedProjects.length / PageItemLedngth) + 1
		: Math.round(sortedProjects.length / PageItemLedngth)

	let { currentPage } = payload
	if (currentPage === undefined) {
		currentPage = 1
	}
	const projects = sortedProjects.slice(
		(currentPage - 1) * PageItemLedngth,
		currentPage * PageItemLedngth,
	)

	return {
		allPage,
		currentPage: payload.currentPage,
		interval: PageItemLedngth,
		items: projects,
	}
}
