import { CLEAR_BUTTON_ERRORS } from 'root/src/client/logic/form/actionIds'

import {
	formStoreLenses,
} from 'root/src/client/logic/form/lenses'

const { dissocPathButtonErrors } = formStoreLenses

export const reducer = (state, { moduleKey }) => dissocPathButtonErrors(
	moduleKey,
	state,
)

export default {
	[CLEAR_BUTTON_ERRORS]: reducer,
}
