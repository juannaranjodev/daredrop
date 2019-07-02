import { assocPath, dissocPath } from 'ramda'
import { CHANGE_EMBEDED_FIELD_DATA } from 'root/src/client/logic/embeded/actionIds'

export default {
	[CHANGE_EMBEDED_FIELD_DATA]: (state, { fieldPath, value }) => {
		if (!value) {
			return dissocPath(fieldPath, state)
		}
		return assocPath(fieldPath, value, state)
	},
}
