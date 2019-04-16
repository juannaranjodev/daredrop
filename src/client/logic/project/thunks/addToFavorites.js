import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { ADD_TO_FAVORITES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { FAVORITES_BUTTON_CLICK_ACTION_REQUEST } from 'root/src/client/logic/project/actionIds'

export default () => async (dispatch, getState) => {
	const state = getState()


	const projectId = currentRouteParamsRecordId(state)

	const apiPayload = {
		projectId,
	}
	return dispatch(apiRequest(ADD_TO_FAVORITES, apiPayload))
}
