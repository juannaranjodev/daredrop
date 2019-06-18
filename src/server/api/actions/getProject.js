import { prop } from 'ramda'

import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import moment from 'moment'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'
import getActiveAssignees from 'root/src/server/api/actionUtil/getActiveAssignees'

export default async ({ userId, payload }) => {
	const projectId = prop('projectId', payload)
	const [project, assignees, myPledge, myFavorites] = await dynamoQueryProject(
		userId, projectId,
	)
	const respons = {
		userId,
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
		return respons
	}
	return {
		status: 410,
		message: 'This dare has expired',
	}
}
