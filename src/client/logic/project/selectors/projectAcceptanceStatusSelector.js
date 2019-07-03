import { filter, length, map, prop, intersection, gt, propEq, head, hasPath } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'
import { notConnected, connectedNotClaimed, accepted, notEligible, videoPendingAproved } from 'root/src/shared/constants/projectAcceptanceStatuses'
import {
	streamerPendingKey,
	streamerAcceptedKey,
	streamerRejectedKey,
	streamerDeliveredKey,
} from 'root/src/server/api/lenses'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	const assigneeNames = intersection(userDataDisplayNames, assigneesDisplayNames)
	const isAssignee = gt(length(assigneeNames), 0)
	const deliveryVideos = filter(hasPath(['deliveryVideo']), assignees)

	if (!isAssignee) {
		return notConnected
	}
	const filteredAssignee = map(assigneeName => head(filter(propEq('displayName', assigneeName), assignees)), assigneeNames)

	const assignee = head(filteredAssignee)
	const acceptanceStatus = prop('accepted', assignee)
	if (
		gt(length(deliveryVideos), 0)
		&& acceptanceStatus === streamerAcceptedKey && 0
	) {
		return videoPendingAproved
	}

	switch (acceptanceStatus) {
		case (streamerPendingKey):
			return connectedNotClaimed
		case (streamerRejectedKey || streamerDeliveredKey):
			return notEligible
		case (streamerAcceptedKey):
			return accepted
		default:
			return notEligible
	}
}
