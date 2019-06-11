import { propOr, isNil, path } from 'ramda'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import addFilterParams from 'root/src/client/logic/header/actions/addFilterParams'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'
import setGameFilterValue from 'root/src/client/logic/header/actions/setGameFilterValue'
import setCurrentPage from 'root/src/client/logic/list/actions/setCurrentPage'
import clearFilterParam from 'root/src/client/logic/header/actions/clearFilterParam'

import { GET_ACTIVE_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default (valueInput, { action }) => async (dispatch, getState) => {
	const state = getState()
	const { filterParams } = state.list
	const value = propOr(valueInput, 'value', valueInput)
	let param = {}
	if (typeof value === 'number') {
		param = { param: 'game', value: String(value) }
		dispatch(setGameFilterValue(valueInput))
		dispatch(setCurrentPage(1))
		dispatch(addFilterParams(param))
		dispatch(clearProjectArray())
		dispatch(apiRequest(GET_ACTIVE_PROJECTS, {
			currentPage: 1,
			filter: isNil(filterParams) ? [param] : [...filterParams, param],
			sortType: state.list.sortType,
		}))
	} else if (action !== 'input-blur' && action !== 'menu-close' && action !== 'set-value') {
		param = { param: 'game', value: '' }
		dispatch(setGameFilterValue(null))
		dispatch(addFilterParams(param))
		dispatch(clearFilterParam({ type: 'game' }))
	}

	if ((action === 'input-change' && valueInput === '') || action === 'clear') {
		dispatch(clearFilterParam({ type: 'game' }))
		dispatch(setCurrentPage(1))
		dispatch(clearProjectArray())
		const newState = getState()
		const newFilterParam = path(['list', 'filterParams'], newState)
		dispatch(apiRequest(GET_ACTIVE_PROJECTS, {
			currentPage: 1,
			filter: isNil(newFilterParam) ? [] : [...newFilterParam],
			sortType: state.list.sortType,
		}))
	}
}
