import { pathOr } from 'ramda'

import { formStoreLenses } from 'root/src/client/logic/form/lenses'

const {
	pathOrButtonErrors,
} = formStoreLenses

export default (state, { moduleKey, buttonName }) => (
	pathOr('', [buttonName], pathOrButtonErrors(moduleKey, {}, state))
)
