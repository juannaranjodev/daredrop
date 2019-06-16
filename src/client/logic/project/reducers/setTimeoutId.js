import { SET_TIMEOUT_ID } from 'root/src/client/logic/project/actionIds'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'

const { setTimeoutId } = appStoreLenses

export default {
	[SET_TIMEOUT_ID]: (state, timeout) => setTimeoutId(timeout, state),
}
