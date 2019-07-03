import { assocPath, dissocPath } from 'ramda'
import { CHANGE_embedded_FIELD_DATA } from 'root/src/client/logic/embedded/actionIds'

export default {
	[CHANGE_embedded_FIELD_DATA]: (state, { fieldPath, value }) => {
		if (!value) {
			return dissocPath(fieldPath, state)
		}
		return assocPath(fieldPath, value, state)
	},
}
