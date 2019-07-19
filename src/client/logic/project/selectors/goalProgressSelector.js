import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'
import { equals, prop, any } from 'ramda'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import {
	projectAcceptedKey, projectDeliveryInitKey, projectDeliveryPendingKey, projectDeliveredKey,
} from 'root/src/shared/descriptions/apiLenses'
import goalAmountSelector from 'root/src/client/logic/project/selectors/goalAmountSelector'

const responseLenses = getResponseLenses(GET_PROJECT)
const {
	viewStatus,
} = responseLenses

export default (state, props) => {
	const record = getRecordSelector(state, props)
	const equalsStatus = equals(viewStatus(record))
	const accepted = any(equalsStatus)([projectAcceptedKey, projectDeliveryInitKey, projectDeliveryPendingKey, projectDeliveredKey])

	if (accepted) {
		const goalAmount = goalAmountSelector(state, props)
		if (equals(goalAmount, 0)) {
			return 5
		}
		const pledgeAmount = prop('pledgeAmount', record)
		const answer = pledgeAmount / goalAmount * 100
		return answer < 5 ? 5 : answer > 100 ? 100 : answer
	}
	return 5
}
