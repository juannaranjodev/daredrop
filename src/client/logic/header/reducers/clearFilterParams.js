import { CLEAR_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'
import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setFilterParams, viewFilterParams } = listStoreLenses

const cleareFilterParamFunc = (state, payload) => {
	const params = viewFilterParams(state)
	if (params) {
		const newParams = params.filter(param => param.param !== payload.type)
		return setFilterParams(newParams, state)
	}
}

export default {
	[CLEAR_FILTER_PARAMS]: cleareFilterParamFunc,
}
