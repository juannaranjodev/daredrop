import { compose } from 'ramda'
import { ADD_SORT_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'

import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setFilterParams, setSortType } = listStoreLenses

export default {
	[ADD_SORT_FILTER_PARAMS]: (state, payload) => {
		const { filter, sortType } = payload
		return compose(
			setFilterParams(filter),
			setSortType(sortType),
		)(state)
	},
}
