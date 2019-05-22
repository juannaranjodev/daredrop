import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'
import { reduce, isNil, equals, prop } from 'ramda'
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
	const { acceptedList } = props
	const record = getRecordSelector(state, props)
	let accepted = false
	if (!isNil(acceptedList)) {
		accepted = acceptedList.includes(viewId(record))
	} else {
		accepted = equals(projectAcceptedKey, viewStatus(record))
	}

	if (accepted) {
		const assignees = viewAssignees(record)
		const pledgeRequest = reduce(
			(accum, assignee) => accum + prop('amountRequested', assignee),
			0,
			assignees,
		)
		const pledgeAmount = viewPledgeAmount(record)
		const onePersent = pledgeRequest / 95
		const answer = (pledgeAmount / onePersent) + 5
		return answer > 100 ? 100 : answer
	}
	return 5
}
