import { SUBMIT_FORM_ERROR } from 'root/src/client/logic/form/actionIds'
import {
	formStoreLenses,
} from 'root/src/client/logic/form/lenses'

const { setFormSubmitError } = formStoreLenses

export default {
	[SUBMIT_FORM_ERROR]: (state, { moduleKey, submitIndex, error }) => setFormSubmitError(
		moduleKey,
		error,
		state
	)
}
