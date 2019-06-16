import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { add, path } from 'ramda'
import setHasMore from 'root/src/client/logic/list/actions/setHasMore'
import getCurrentModuleId from 'root/src/client/logic/route/util/getCurrentModuleId'
import getEndpointIdFromModules from 'root/src/client/logic/route/util/getEndpointIdFromModules'

export default (currentPage, hasMore) => async (dispatch, getState) => {
	const state = getState()
	if (currentPage !== undefined && hasMore) {
		dispatch(setHasMore(false))
		const currentModuleId = getCurrentModuleId()
		const endpointId = getEndpointIdFromModules(currentModuleId)
		let realEndpoint
		if (typeof endpointId === 'string') {
			realEndpoint = endpointId
		} else if (!endpointId) {
			return
		}
		[realEndpoint] = endpointId

		return dispatch(apiRequest(realEndpoint, {
			currentPage: add(currentPage, 1),
			filter: path(['list', 'filterParams'], state),
			sortType: path(['list', 'sortType'], state),
		}))
	}
}
