import { CHANGE_EMBEDDED_FIELD_DATA } from 'root/src/client/logic/embedded/actionIds'

export default (fieldPath, value) => ({
	type: CHANGE_EMBEDDED_FIELD_DATA,
	payload: {
		fieldPath,
		value,
	},
})
