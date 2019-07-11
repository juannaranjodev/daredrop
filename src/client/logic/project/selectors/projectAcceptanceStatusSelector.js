import { filter, length, map, prop, intersection, gt, propEq, head, equals } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'
import statusSelector from 'root/src/client/logic/project/selectors/statusSelector'
import {
	notConnected, connectedNotClaimed,
	accepted, notEligible,
	videoPending,
	videoApproved,
} from 'root/src/shared/constants/projectAcceptanceStatuses'
import {
	streamerPendingKey,
	streamerAcceptedKey,
	streamerRejectedKey,
	projectDeliveredKey,
	projectDeliveryPendingKey,
} from 'root/src/shared/descriptions/apiLenses'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	const assigneeNames = intersection(userDataDisplayNames, assigneesDisplayNames)
	const isAssignee = gt(length(assigneeNames), 0)
	const projectStatus = statusSelector(state, props)
	if (!isAssignee) {
		return notConnected
	}
	const filteredAssignee = map(assigneeName => head(filter(propEq('displayName', assigneeName), assignees)), assigneeNames)

	const assignee = head(filteredAssignee)
	const acceptanceStatus = prop('accepted', assignee)
	if (equals(projectStatus, projectDeliveredKey)) {
		return videoApproved
	}
	switch (acceptanceStatus) {
		case (streamerPendingKey):
			return connectedNotClaimed
		case (streamerRejectedKey):
			return notEligible
		case (streamerAcceptedKey):
			if (equals(projectStatus, projectDeliveryPendingKey)) {
				return videoPending
			}
			return accepted
		default:
			return notEligible
	}
}
