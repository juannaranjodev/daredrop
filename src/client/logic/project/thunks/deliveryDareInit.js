import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { assoc, compose, path, dissoc } from 'ramda'

export default formData => async (dispatch, getState) => {
	const state = getState()
	const projectId = currentRouteParamsRecordId(state)
	const formDataWithoutVideo = compose(dissoc('videoAttach'), assoc('videoName', path(['videoAttach', 'name'], formData)))(formData)
	const apiPayload = {
		...formDataWithoutVideo,
		projectId,
	}
	return dispatch(apiRequest(DELIVERY_DARE_INIT, apiPayload))
}
