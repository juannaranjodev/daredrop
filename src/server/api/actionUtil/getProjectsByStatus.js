import { sort, map, range, reduce, filter, contains, prop } from 'ramda'

import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import dynamoQueryShardedProjects from 'root/src/server/api/actionUtil/dynamoQueryShardedProjects'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import getPendingOrAcceptedAssignees from 'root/src/server/api/actionUtil/getPendingOrAcceptedAssignees'

import { sortByType } from 'root/src/server/api/actionUtil/sortUtil'

import getFilteredProjectIds from 'root/src/server/api/actionUtil/getFilteredProjectIds'

const PageItemLength = 8

export default async (status, defaultSortType, payload) => {
	const realPayload = payload.payload
	const projectsDdb = await dynamoQueryShardedProjects(status)

	const serializedProjects = map(([projectDdb, assigneesDdb]) => projectSerializer([
		...projectDdb,
		...getPendingOrAcceptedAssignees(assigneesDdb),
	]), projectsDdb)

	// Filter expired projects
	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}
	let filteredProjects = filter(filterExpired, serializedProjects)

	// Start Filter with filter items
	const filteredProjectIds = await getFilteredProjectIds(prop('filter', realPayload))
	const filterByIds = dare => contains({ id: dare.pk }, serializedProjects)

	if (filteredProjectIds != null) {
		filteredProjects = filter(filterByIds, filteredProjects)
	}
	// End Filter with filter items

	const diffBySortType = prop(realPayload.sortType, sortByType)
		? prop(realPayload.sortType, sortByType) : prop(defaultSortType, sortByType)
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
		items: projects,
	}
}
