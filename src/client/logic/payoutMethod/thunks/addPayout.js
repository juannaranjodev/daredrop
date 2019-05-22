import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { ADD_PAYOUT_METHOD, UPDATE_PAYOUT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'
import getPayoutDataSelector from 'root/src/client/logic/payoutMethod/selectors/getPayoutDataSelector'
import { payoutMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default (formData, props) => async (dispatch, getState) => {
	const state = getState()
	const payout = getPayoutDataSelector(state, payoutMethod)

	const { email } = formData
	const apiPayload = {
		...formData,
		email: email,
	}
	if (payout && payout.email) {
		return dispatch(apiRequest(UPDATE_PAYOUT_METHOD, apiPayload))
	}
	return dispatch(apiRequest(ADD_PAYOUT_METHOD, apiPayload))
}
