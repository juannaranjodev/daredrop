import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import addSortParams from 'root/src/client/logic/header/actions/addSortParams'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'

import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default value => async (dispatch, getState) => {
	const state = getState()
	dispatch(addSortParams(value.value))
	dispatch(clearProjectArray())
	dispatch(apiRequest(GET_ACTIVE_PROJECTS, {
		currentPage: 1,
		filter: state.list.filterParams,
		sortType: value.value,
	}))
}
