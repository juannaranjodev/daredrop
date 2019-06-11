import { map, prop, omit, contains } from 'ramda'

export default (project, deliveryStatus, userTokensStr) => ({
	...omit(['status', 'id'], project),
	assignees: map((assignee) => {
		const assigneeId = `${assignee.platform}|${assignee.platformId}`
		if (contains(assigneeId, userTokensStr)) {
			return { ...assignee, deliveryVideo: deliveryStatus }
		}
		return assignee
	}, prop('assignees', project)),
})
