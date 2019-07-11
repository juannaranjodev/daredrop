import { SET_BUTTON_ERRORS } from 'root/src/client/logic/form/actionIds'

export default (moduleKey, errors) => ({
	type: SET_BUTTON_ERRORS,
	payload: { moduleKey, errors },
})
