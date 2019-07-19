import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'
import { reduce, isNil, prop, equals, any } from 'ramda'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import {
	projectAcceptedKey, projectDeliveryInitKey, projectDeliveryPendingKey, projectDeliveredKey,
} from 'root/src/shared/descriptions/apiLenses'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewAssignees, viewStatus } = responseLenses

export default (state, props) => {
	const record = getRecordSelector(state, props)
	const assignees = viewAssignees(record)
	const equalsStatus = equals(viewStatus(record))
	const accepted = any(equalsStatus)([projectAcceptedKey, projectDeliveryInitKey, projectDeliveryPendingKey, projectDeliveredKey])
	if (accepted) {
		return reduce(
			(accum, assignee) => {
				const amountRequest = prop('amountRequested', assignee)
				return isNil(amountRequest) ? accum + 0 : accum + amountRequest
			},
			0,
			assignees,
		)
	}
	return 0
}
