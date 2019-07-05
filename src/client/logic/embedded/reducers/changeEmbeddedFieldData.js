import { assocPath, dissocPath } from 'ramda'
import { CHANGE_EMBEDDED_FIELD_DATA } from 'root/src/client/logic/embedded/actionIds'

export default {
	[CHANGE_EMBEDDED_FIELD_DATA]: (state, { fieldPath, value }) => {
		if (!value) {
			return dissocPath(fieldPath, state)
		}
		return assocPath(fieldPath, value, state)
	},
}
