import { ADD_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'

import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setFilterParams, viewFilterParams } = listStoreLenses

export const addFilterParamsFunc = (state, payload) => {
	const params = viewFilterParams(state)
	if (params) {
		const newParams = params.filter(param => param.param !== payload.param)
		return setFilterParams([...newParams, payload], state)
	}
	return setFilterParams([payload], state)
}

export default {
	[ADD_FILTER_PARAMS]: addFilterParamsFunc,
}
