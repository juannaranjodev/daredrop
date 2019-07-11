import { compose } from 'ramda'
import { ADD_SORT_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'

import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setFilterParams, setSortType } = listStoreLenses

export default {
	[ADD_SORT_FILTER_PARAMS]: (state, { moduleId, params }) => {
		const { filter, sortType } = params
		return compose(
			setFilterParams(moduleId, filter),
			setSortType(moduleId, sortType),
		)(state)
	},
}
