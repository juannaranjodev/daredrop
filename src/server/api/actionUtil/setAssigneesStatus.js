import { map, prop, omit, contains } from 'ramda'

export default (project, assigneeStatus, userTokensStr, amountRequested) => ({
	...omit(['id'], project),
	assignees: map((assignee) => {
		const assigneeId = `${assignee.platform}|${assignee.platformId}`
		if (contains(assigneeId, userTokensStr)) {
			return { ...assignee, accepted: assigneeStatus, amountRequested }
		}
		return assignee
	}, prop('assignees', project)),
})
