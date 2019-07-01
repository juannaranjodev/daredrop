import { isNil } from 'ramda'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'
import moduleListPayloadMapSelector from 'root/src/client/logic/api/selectors/moduleListPayloadMapSelector'
import clearListProcessing from 'root/src/client/logic/api/actions/clearListProcessing'
import clearList from 'root/src/client/logic/api/actions/clearList'
import setFirstPage from 'root/src/client/logic/list/actions/setFirstPage'

export default ({ moduleId }, { list }) => async (dispatch) => {
	const endpointId = moduleEndpointIdSelector({ /* state */ }, { moduleId })
	const payload = moduleListPayloadMapSelector({}, { moduleId })
	dispatch(setFirstPage())
	dispatch(clearListProcessing())
	dispatch(clearList())
	const newPayload = {
		...payload,
		filter: !isNil(list) && !isNil(list.filterParams) ? list.filterParams : undefined,
		sortType: !isNil(list) && !isNil(list.sortType) ? list.sortType : undefined,
	}
	if (typeof endpointId === 'string') {
		return [dispatch(apiRequest(endpointId, newPayload))]
	}
	return endpointId.map(
		endpoint => dispatch(apiRequest(endpoint, newPayload)),
	)
}
