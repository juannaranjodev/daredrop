import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default message => async (dispatch, getState) => {
	const state = getState()
	const projectId = currentRouteParamsRecordId(state)
	let apiPayload
	if (message) {
		apiPayload = {
			projectId,
			message,
		}
	} else {
		apiPayload = {
			projectId,
		}
	}
	return dispatch(apiRequest(REJECT_PROJECT, apiPayload))
}
