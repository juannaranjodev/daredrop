import { SET_GAME_FILTER_VALUE } from 'root/src/client/logic/header/actionsIds'
import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setGameFilterValue } = listStoreLenses

export const setGameFilterValueFunc = (state, payload) => setGameFilterValue(payload, state)

export default {
	[SET_GAME_FILTER_VALUE]: setGameFilterValueFunc,
}
