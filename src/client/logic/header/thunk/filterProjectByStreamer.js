import { propOr, isNil } from 'ramda'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import addFilterParams from 'root/src/client/logic/header/actions/addFilterParams'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'
import setStreamerFilterValue from 'root/src/client/logic/header/actions/setStreamerFilterValue'
import setCurrentPage from 'root/src/client/logic/list/actions/setCurrentPage'
import clearFilterParam from 'root/src/client/logic/header/actions/clearFilterParam'

import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default (valueInput, { action }) => async (dispatch, getState) => {
	const state = getState()
	const { filterParam } = state.list
	const value = propOr(valueInput, 'value', valueInput)
	let param = {}

	if (typeof value === 'number') {
		dispatch(setStreamerFilterValue(valueInput))
		param = { param: 'assignee|twitch', value: String(value) }
		dispatch(setCurrentPage(1))
		dispatch(addFilterParams(param))
		dispatch(clearProjectArray())
		dispatch(apiRequest(GET_ACTIVE_PROJECTS, {
			currentPage: 1,
			filter: isNil(filterParam) ? [param] : [...filterParam, param],
			sortType: state.list.sortType,
		}))
	} else if (action !== 'input-blur' && action !== 'menu-close' && action !== 'set-value') {
		param = { param: 'assignee|twitch', value: '' }
		dispatch(setStreamerFilterValue(null))
		dispatch(addFilterParams(param))
		dispatch(setCurrentPage(1))
		dispatch(clearProjectArray())
	}

	if (action === 'input-change' && valueInput === '') {
		dispatch(clearFilterParam({ type: 'assignee|twitch' }))
		dispatch(apiRequest(GET_ACTIVE_PROJECTS, {
			currentPage: 1,
			sortType: state.list.sortType,
		}))
	}
}
