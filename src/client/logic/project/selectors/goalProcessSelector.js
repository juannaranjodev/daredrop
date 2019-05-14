import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'


const responseLenses = getResponseLenses(GET_PROJECT)
const {
	viewId,
	viewAmountRequested,
	viewPledgeAmount,
} = responseLenses

export default (state, props) => {
	const { acceptedList } = props
	const record = getRecordSelector(state, props)
	const accepted = acceptedList.includes(viewId(record))
	if (accepted) {
		const pledgeAmount = viewPledgeAmount(record)
		const pledgeRequest = viewAmountRequested(record)
		const onePersent = pledgeRequest / 95
		return (pledgeAmount / onePersent) + 5
	}
	return 5
}
