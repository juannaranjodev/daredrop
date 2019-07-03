import { SET_LOADING_BLOCK } from 'root/src/client/logic/form/actionIds'
import { formStoreLenses } from 'root/src/client/logic/form/lenses'

const { setFormLoadingBlock } = formStoreLenses

export default {
	[SET_LOADING_BLOCK]: (state, payload) => setFormLoadingBlock(payload, state),
}
