import { filter } from 'ramda'
import { CLEAR_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'
import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setFilterParams, viewFilterParams } = listStoreLenses

const cleareFilterParamFunc = (state, payload) => {
	const params = viewFilterParams(state)
	if (params) {
		const newParams = filter(param => param.param !== payload.type, params)
		return setFilterParams(newParams, state)
	}
}

export default {
	[CLEAR_FILTER_PARAMS]: cleareFilterParamFunc,
}
