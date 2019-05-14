import { sort, map, filter, dissoc, compose } from 'ramda'

import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import dynamoQueryShardedProjects from 'root/src/server/api/actionUtil/dynamoQueryShardedProjects'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

const PageItemLength = 8

export default async (status, sortKey, payload) => {
	const projectsDdb = await dynamoQueryShardedProjects(status)

	const serializedProjects = map(compose(dissoc('myPledge'), projectSerializer), projectsDdb)

	// Filter expired projects
	const filterExpired = (dare) => {
		const diff = moment().diff(dare.approved, 'days')
		return diff <= daysToExpire
	}

	const filteredProjects = filter(filterExpired, serializedProjects)

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
		items: projects,
	}
}
