import { isNil, path } from 'ramda'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'
import moduleListPayloadMapSelector from 'root/src/client/logic/api/selectors/moduleListPayloadMapSelector'
import clearListProcessing from 'root/src/client/logic/api/actions/clearListProcessing'
import clearList from 'root/src/client/logic/api/actions/clearList'
import setFirstPage from 'root/src/client/logic/list/actions/setFirstPage'
import sortFilterModuleSelector from 'root/src/client/logic/api/selectors/sortFilterModuleSelector'

export default ({ moduleId }, { list }) => async (dispatch) => {
	const endpointId = moduleEndpointIdSelector({ /* state */ }, { moduleId })
	dispatch(setFirstPage())
	const payload = moduleListPayloadMapSelector({}, { moduleId })
	dispatch(clearListProcessing())
	dispatch(clearList())
	const sortFilterModule = sortFilterModuleSelector(moduleId)
	const newPayload = {
		...payload,
		filter: path([sortFilterModule, 'filterParams'], list),
		sortType: path([sortFilterModule, 'sortType'], list),
	}
	if (typeof endpointId === 'string') {
		return [dispatch(apiRequest(endpointId, newPayload))]
	}
	return endpointId.map(
		endpoint => dispatch(apiRequest(endpoint, newPayload)),
	)
}
