/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
import { prop, reduce, propOr, filter, not, propEq, toString } from 'ramda'
import changeEmbeddedFieldData from 'root/src/client/logic/embedded/actions/changeEmbeddedFieldData'
import allFieldsValuesSelector from 'root/src/client/logic/embedded/selectors/allFieldsValuesSelector'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import clearProjectArray from 'root/src/client/logic/header/actions/clearProjectArray'
import addSortFilterParams from 'root/src/client/logic/header/actions/addSortFilterParams'

export const setInputHof = changeEmbeddedFieldDataFn => (moduleId, fieldPath, value, endpointId) => async (dispatch, getState) => {
	dispatch(changeEmbeddedFieldDataFn(fieldPath, value))
	const state = getState()
	const fieldsValue = allFieldsValuesSelector(state, { moduleId })
	const requestPayload = reduce((acc, key) => {
		const item = prop(key, fieldsValue)
		const prevFilter = propOr([], 'filter', acc)
		switch (key) {
			case 'sort':
				return { ...acc, sortType: prop('value', item) }
			case 'game':
			case 'assignee|twitch':
				const filteredFilter = filter(item => not(propEq('param', key, item)), prevFilter)
				const newFilter = [...filteredFilter, { param: key, value: toString(prop('value', item)) }]
				return { ...acc, filter: newFilter }
			default:
				return acc
		}
	}, { currentPage: 1 }, Object.keys(fieldsValue))
	dispatch(addSortFilterParams(requestPayload))
	dispatch(clearProjectArray())
	dispatch(apiRequest(endpointId, requestPayload))
}

export default setInputHof(
	changeEmbeddedFieldData,
)
