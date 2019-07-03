import { CHANGE_EMBEDED_FIELD_DATA } from 'root/src/client/logic/embeded/actionIds'

export default (fieldPath, value) => ({
	type: CHANGE_EMBEDED_FIELD_DATA,
	payload: {
		fieldPath,
		value,
	},
})
