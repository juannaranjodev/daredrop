/* eslint-disable consistent-return */
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { add, path, head } from 'ramda'
import setHasMore from 'root/src/client/logic/list/actions/setHasMore'
import getCurrentModuleId from 'root/src/client/logic/route/util/getCurrentModuleId'
import getEndpointIdFromModules from 'root/src/client/logic/route/util/getEndpointIdFromModules'
import sortFilterModuleSelector from 'root/src/client/logic/api/selectors/sortFilterModuleSelector'

export default (moduleId, currentPage, hasMore) => async (dispatch, getState) => {
	const state = getState()
	if (currentPage !== undefined && hasMore) {
		dispatch(setHasMore(false))
		const currentModuleId = getCurrentModuleId()
		const endpointId = getEndpointIdFromModules(currentModuleId)
		let realEndpoint

		switch (typeof endpointId) {
			case 'string':
				realEndpoint = endpointId
				break
			case 'object':
				realEndpoint = head(endpointId)
				break
			default:
				return
		}

		const sortFilterModule = sortFilterModuleSelector(moduleId)

		return dispatch(apiRequest(realEndpoint, {
			currentPage: add(currentPage, 1),
			filter: path(['list', sortFilterModule, 'filterParams'], state),
			sortType: path(['list', sortFilterModule, 'sortType'], state),
		}))
	}
}
