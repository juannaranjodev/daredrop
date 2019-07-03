import { map, prop, omit, contains } from 'ramda'

export default (project, deliveryStatus, userTokensStr) => ({
	...omit(['status', 'id'], project),
	assignees: map((assignee) => {
		const assigneeId = `${assignee.platform}|${assignee.platformId}`
		return assignee
	}, prop('assignees', project)),
})
