import { filter, length, map, prop, intersection, gt, propEq, head } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'
import { notConnected, connectedNotClaimed, accepted, notEligible } from 'root/src/shared/constants/projectAcceptanceStatuses'
import {
	projectPendingKey,
	projectAcceptedKey,
	projectStreamerRejectedKey,
	projectDeliveredKey,
} from 'root/src/server/api/lenses'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	const assigneeNames = intersection(userDataDisplayNames, assigneesDisplayNames)
	const isAssignee = gt(length(assigneeNames), 0)
	if (!isAssignee) {
		return notConnected
	}
	const filteredAssignee = map(assigneeName => head(filter(propEq('displayName', assigneeName), assignees)), assigneeNames)

	const assignee = head(filteredAssignee)
	const acceptanceStatus = prop('accepted', assignee)

	switch (acceptanceStatus) {
		// case (projectPendingKey):
		// 	return connectedNotClaimed
		case (projectStreamerRejectedKey || projectDeliveredKey):
			return notEligible
		case (projectAcceptedKey):
			return accepted
		default:
			// here until fix of backend part of this feature
			// this button will be shown, correct solution is the last one below
			return accepted
		// return connectedNotClaimed
		// return notEligible
	}
}
