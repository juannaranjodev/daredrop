import { filter, length, map, prop, intersection, gt, propEq, head, isNil, equals } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'
import { notConnected, connectedNotClaimed, accepted, notEligible, videoPendingAproved } from 'root/src/shared/constants/projectAcceptanceStatuses'
import {
	streamerPendingKey,
	streamerAcceptedKey,
	streamerRejectedKey,
	streamerDeliveredKey,
	streamerDeliveryApprovedKey,
	streamerDeliveryRejectedKey,
} from 'root/src/server/api/lenses'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	const assigneeNames = intersection(userDataDisplayNames, assigneesDisplayNames)
	const isAssignee = gt(length(assigneeNames), 0)
	console.log('assignees', assignees, 'userData', userData, 'userDataDisplayNames', userDataDisplayNames, 'assigneesDisplayNames', assigneesDisplayNames, 'assigneeNames', assigneeNames, 'isAssignee', isAssignee)
	const matches = head(assigneeNames)
	const assigneObject = head(filter(assigne => equals(prop('displayName', assigne), matches), assignees))
	const deliveryVideoStatus = prop('deliveryVideo', assigneObject)

	if (!isAssignee) {
		return notConnected
	}
	const filteredAssignee = map(assigneeName => head(filter(propEq('displayName', assigneeName), assignees)), assigneeNames)

	const assignee = head(filteredAssignee)
	const acceptanceStatus = prop('accepted', assignee)
	if (
		!isNil(deliveryVideoStatus)
		&& (
			acceptanceStatus !== streamerDeliveryApprovedKey
			&& acceptanceStatus !== streamerDeliveryRejectedKey)
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
