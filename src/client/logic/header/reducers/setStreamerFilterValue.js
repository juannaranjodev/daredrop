import { SET_STREAMER_FILTER_VALUE } from 'root/src/client/logic/header/actionsIds'
import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { setStreamerFilterValue } = listStoreLenses

export const setStreamerFilterValueFunc = (state, payload) => setStreamerFilterValue(payload, state)

export default {
	[SET_STREAMER_FILTER_VALUE]: setStreamerFilterValueFunc,
}
