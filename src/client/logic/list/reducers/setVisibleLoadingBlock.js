import { listStoreLenses } from 'root/src/client/logic/list/lenses'
import { SET_LOADING_BLOCK } from 'root/src/client/logic/list/actionIds'

const { setLoadingBlockVisible } = listStoreLenses

const setVisibleLoadingBlockFunction = (state, payload) => setLoadingBlockVisible(payload, state)

export default {
	[SET_LOADING_BLOCK]: setVisibleLoadingBlockFunction,
}
