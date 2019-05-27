import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'
import { reduce, isNil, equals, propOr, prop } from 'ramda'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'
import {
	projectAcceptedKey,
} from 'root/src/server/api/lenses'

const responseLenses = getResponseLenses(GET_PROJECT)
const {
	viewId,
	viewAmountRequested,
	viewPledgeAmount,
	viewAssignees,
	viewStatus,
} = responseLenses

export default (state, props) => {
	const record = getRecordSelector(state, props)
	const accepted = equals(projectAcceptedKey, viewStatus(record))

	if (accepted) {
		const assignees = viewAssignees(record)
		const pledgeRequest = reduce(
			(accum, assignee) => {
				const amountRequest = prop('amountRequested', assignee)
				return isNil(amountRequest) ? accum + 0 : accum + amountRequest
			},
			0,
			assignees,
		)
		const pledgeAmount = prop('pledgeAmount', record)
		const onePersent = pledgeRequest / 95
		const answer = (pledgeAmount / onePersent) + 5
		return answer > 100 ? 100 : answer
	}
	return 5
}