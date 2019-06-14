import { SET_SORT_VALUE } from 'root/src/client/logic/header/actionsIds'
import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setSortValue } = listStoreLenses

const setSortValueFn = (state, payload) => setSortValue(payload, state)

export default {
	[SET_SORT_VALUE]: setSortValueFn,
}
