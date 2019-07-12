/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
import { prop, reduce, propOr, filter, not, propEq, toString, contains, equals } from 'ramda'
import changeEmbeddedFieldData from 'root/src/client/logic/embedded/actions/changeEmbeddedFieldData'
import allFieldsValuesSelector from 'root/src/client/logic/embedded/selectors/allFieldsValuesSelector'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import addSortFilterParams from 'root/src/client/logic/header/actions/addSortFilterParams'
import setFirstPage from 'root/src/client/logic/list/actions/setFirstPage'
import myDataSelector from 'root/src/client/logic/embedded/selectors/myDataSelector'
import filterConstants from 'root/src/shared/constants/filterConstants'
import setLoadingBlock from 'root/src/client/logic/list/actions/setLoadingBlock'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'

export const setInputHof = changeEmbeddedFieldDataFn => (moduleId, fieldPath, value, endpointId) => async (dispatch, getState) => {
	dispatch(setFirstPage())
	dispatch(changeEmbeddedFieldDataFn(fieldPath, value))
	const state = getState()
	const fieldsValue = allFieldsValuesSelector(state, { moduleId })
	const requestPayload = reduce((acc, key) => {
		const item = prop(key, fieldsValue)
		const prevFilter = propOr([], 'filter', acc)
		const filteredFilter = filter(item => not(propEq('param', key, item)), prevFilter)
		const newFilter = nextFilter => [...filteredFilter, nextFilter]

		// here two separate conditionals for key just for
		// readability - if else fits better for multiline code
		if (equals(key, 'filter')) {
			const { payload } = item
			if (!payload) {
				return acc
			}
			let { param, value } = payload
			if (contains(value, filterConstants)) {
				value = myDataSelector(value, state)
			}
			return { ...acc, filter: newFilter({ param, value }) }
		}

		switch (key) {
			case 'sort':
				return { ...acc, sortType: prop('value', item) }
			case 'game':
				return { ...acc, filter: newFilter({ param: key, value: toString(prop('value', item)) }) }
			case 'assignee':
				return { ...acc, filter: newFilter({ param: key, value: `twitch|${toString(prop('value', item))}` }) }
			default:
				return acc
		}
	}, { currentPage: 1, filter: undefined, sortType: undefined }, Object.keys(fieldsValue))
	dispatch(addSortFilterParams(moduleId, requestPayload))
	dispatch(clearProjectArray(moduleId))
	dispatch(setLoadingBlock(true))
	dispatch(apiRequest(endpointId, requestPayload, true))
		.then(() => dispatch(setLoadingBlock(false)))
}

export default setInputHof(
	changeEmbeddedFieldData,
)
