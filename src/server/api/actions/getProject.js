import { prop, omit, filter, propEq, map, replace, compose, intersection, gt, length } from 'ramda'

import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectApprovedKey, streamerRejectedKey } from 'root/src/shared/descriptions/apiLenses'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'

export default async ({ userId, payload }) => {
	const projectId = prop('projectId', payload)
	const [project, assignees, myPledge, myFavorites] = await dynamoQueryProject(
		userId, projectId,
	)

	let userRejectedDare = false
	if (userId) {
		const userTokens = await dynamoQueryOAuth(userId)
		const assigneeTokens = map(compose(replace(/token-/, 'assignee|'), prop('sk')), userTokens)
		const rejectedTokensInProject = map(prop('sk'), filter(propEq('accepted', streamerRejectedKey), assignees))
		const userTokensRejected = intersection(assigneeTokens, rejectedTokensInProject)
		userRejectedDare = gt(length(userTokensRejected), 0)
	}

	const respons = {
		userId,
		userRejectedDare,
		...projectSerializer([
			...project,
			...getActiveAssignees(assignees),
			...myPledge,
			...myFavorites,
		]),
	}

	const diff = moment().diff(respons.created, 'days')
	const nowHours = moment(respons.created).day()
	if (!(diff > daysToExpire && Number(nowHours) > 17 && respons.status === projectApprovedKey)) {
		return userId ? respons : omit(['myFavorites', 'myPledge'], respons)
	}
	return {
		status: 410,
		message: 'This dare has expired',
	}
}
