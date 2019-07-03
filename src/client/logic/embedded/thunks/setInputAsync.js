/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
import { prop, reduce, propOr, filter, not, propEq, toString } from 'ramda'
import changeEmbeddedFieldData from 'root/src/client/logic/embedded/actions/changeEmbeddedFieldData'
import allFieldsValuesSelector from 'root/src/client/logic/embedded/selectors/allFieldsValuesSelector'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'
import addSortFilterParams from 'root/src/client/logic/header/actions/addSortFilterParams'
import setFirstPage from 'root/src/client/logic/list/actions/setFirstPage'
import myDataSelector from 'root/src/client/logic/embedded/selectors/myDataSelector'

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
		switch (key) {
			case 'sort':
				return { ...acc, sortType: prop('value', item) }
			case 'game':
				return { ...acc, filter: newFilter({ param: key, value: toString(prop('value', item)) }) }
			case 'assignee':
				return { ...acc, filter: newFilter({ param: key, value: `twitch|${toString(prop('value', item))}` }) }
			case 'filter':
				const { payload } = item
				if (!payload) {
					return acc
				}
				let { param, value } = payload
				value = myDataSelector(value, state)
				return { ...acc, filter: newFilter({ param, value }) }
			default:
				return acc
		}
	}, { currentPage: 1 }, Object.keys(fieldsValue))
	dispatch(addSortFilterParams(moduleId, requestPayload))
	dispatch(clearProjectArray(moduleId))
	dispatch(apiRequest(endpointId, requestPayload))
}

export default setInputHof(
	changeEmbeddedFieldData,
)
