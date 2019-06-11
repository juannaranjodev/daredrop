import { ADD_SORT_PARAMS } from 'root/src/client/logic/header/actionsIds'

import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setSortType } = listStoreLenses

export const addSortParamsFunc = (state, payload) => setSortType(payload, state)

export default {
	[ADD_SORT_PARAMS]: addSortParamsFunc,
}
