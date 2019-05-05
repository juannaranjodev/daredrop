import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default formData => async (dispatch, getState) => {
	const state = getState()
	const projectId = currentRouteParamsRecordId(state)
	const apiPayload = {
		...formData,
		projectId,
	}
	return dispatch(apiRequest(ACCEPT_PROJECT, apiPayload))
}
