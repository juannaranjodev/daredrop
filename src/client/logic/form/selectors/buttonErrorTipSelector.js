import { pathOr } from 'ramda'

import { formStoreLenses } from 'root/src/client/logic/form/lenses'

const {
	pathOrFieldErrors,
} = formStoreLenses

export default (state, { moduleKey, buttonName }) => (
	console.log(pathOrFieldErrors(moduleKey, {}, state))
)
