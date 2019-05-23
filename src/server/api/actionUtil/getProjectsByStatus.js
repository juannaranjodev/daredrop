import { sort, map, filter, dissoc, compose, contains, prop } from 'ramda'

import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import dynamoQueryShardedProjects from 'root/src/server/api/actionUtil/dynamoQueryShardedProjects'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import adminProjectSerializer from 'root/src/server/api/serializers/adminProjectSerializer'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { sortByType } from 'root/src/server/api/actionUtil/sortUtil'

import getFilteredProjectIds from 'root/src/server/api/actionUtil/getFilteredProjectIds'

const PageItemLength = 8

export default async (status, defaultSortType, payload, isAdminEndpoint) => {
	const realPayload = payload.payload
	const projectsDdb = await dynamoQueryShardedProjects(status)

	const serializedProjects = ternary(isAdminEndpoint,
		map(compose(dissoc('myPledge'), adminProjectSerializer), projectsDdb),
		map(compose(dissoc('myPledge'), projectSerializer), projectsDdb),
		) 

	// Filter expired projects
	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}
	let filteredProjects = filter(filterExpired, serializedProjects)

	// Start Filter with filter items
	const filteredProjectIds = await getFilteredProjectIds(prop('filter', realPayload))
	const filterByIds = dare => contains({ id: dare.id }, filteredProjectIds)

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
