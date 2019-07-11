import { CLEAR_BUTTON_ERRORS } from 'root/src/client/logic/form/actionIds'

export default moduleKey => ({
	type: CLEAR_BUTTON_ERRORS,
	payload: { moduleKey },
})
