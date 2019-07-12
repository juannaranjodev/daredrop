import { uniq, prop, sort, filter, map, startsWith, anyPass, equals, contains } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp, projectDeliveredKey, streamerAcceptedKey } from 'root/src/shared/descriptions/apiLenses'
import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import { sortByType } from 'root/src/server/api/actionUtil/sortUtil'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'
import dynamoGetTokenIdFromUserId from 'root/src/server/api/actionUtil/dynamoGetTokenIdFromUserId'
import { SORT_BY_CREATED_DESC } from 'root/src/shared/constants/sortTypesOfProject'
import paginate from 'root/src/server/api/actionUtil/paginate'

import getFilteredProjectIds from 'root/src/server/api/actionUtil/getFilteredProjectIds'

const PageItemLength = 8


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

	const twitchId = await dynamoGetTokenIdFromUserId(userId, 'twitch')

	const assigneeProjectDdb = await documentClient.query({
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
		ExpressionAttributeValues: {
			':pk': `assignee|twitch|${twitchId}`,
		},
	}).promise()

	const filterAccepted = dare => equals(streamerAcceptedKey, prop('accepted', dare))
	const acceptedProjects = filter(filterAccepted, dynamoItemsProp(assigneeProjectDdb))
	const pledgedProjects = dynamoItemsProp(pledgedProjectsDdb)
	const favoritesProjects = dynamoItemsProp(favoritesProjectsDdb)

	const myProjectsIdsArr = uniq(map(prop('pk'), [...pledgedProjects, ...favoritesProjects, ...acceptedProjects]))

	const myProjects = await Promise.all(map(projectId => dynamoQueryProject(null, projectId),
		myProjectsIdsArr))

	const myProjectsSerialized = map(([project, assignees]) => projectSerializer([
		...project,
		...getActiveAssignees(assignees),
	]), myProjects)

	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}

	const dontFilterDelivered = dare => startsWith(prop('status', dare), projectDeliveredKey)

	// default endpoint filters
	let filteredProjects = filter(anyPass([filterExpired, dontFilterDelivered]), myProjectsSerialized)

	// payload filters
	const filteredProjectIds = await getFilteredProjectIds(prop('filter', payload))
	if (filteredProjectIds != null) {
		const filterByIds = dare => contains({ id: dare.id }, filteredProjectIds)
		filteredProjects = filter(filterByIds, filteredProjects)
	}

	// sorting and pagination
	const diffBySortType = prop(SORT_BY_CREATED_DESC, sortByType)
	const sortedProjects = sort(diffBySortType, filteredProjects)
	const allPage = paginate(sortedProjects, PageItemLength)

	let { currentPage } = payload
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
		items: projects,
	}
}
