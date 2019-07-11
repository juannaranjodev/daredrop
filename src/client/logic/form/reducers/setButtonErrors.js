import { SET_BUTTON_ERRORS } from 'root/src/client/logic/form/actionIds'

import {
	formStoreLenses,
} from 'root/src/client/logic/form/lenses'

const { setButtonErrors } = formStoreLenses

export const reducer = (state, { moduleKey, errors }) => setButtonErrors(
	moduleKey,
	errors,
	state,
)

export default {
	[SET_BUTTON_ERRORS]: reducer,
}
