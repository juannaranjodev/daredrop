import { SET_VISIBLE_SUCCESS_MESSAGE } from 'root/src/client/logic/app/actionIds'

export default (show, { x, y }, text) => ({
	type: SET_VISIBLE_SUCCESS_MESSAGE,
	payload: {
		show,
		position: { x, y },
		text,
	},
})
