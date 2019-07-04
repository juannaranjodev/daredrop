import { SET_VISIBLE_SUCCESS_MESSAGE } from 'root/src/client/logic/app/actionIds'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'

const { setSuccessMessage } = appStoreLenses

const setVisibleSuccessMessage = (state, payload) => setSuccessMessage(payload, state)

export default {
	[SET_VISIBLE_SUCCESS_MESSAGE]: setVisibleSuccessMessage,
}
