import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'
import moduleListPayloadMapSelector from 'root/src/client/logic/api/selectors/moduleListPayloadMapSelector'

export default ({ moduleId }) => async (dispatch) => {
	const endpointId = moduleEndpointIdSelector({ /* state */ }, { moduleId })
	const payload = moduleListPayloadMapSelector({}, { moduleId })
	if (typeof endpointId === 'string') {
		return [dispatch(apiRequest(endpointId, payload !== undefined ? payload : {}))]
	}
	return endpointId.map(
		endpoint => dispatch(apiRequest(endpoint, payload !== undefined ? payload : {})),
	)
}
