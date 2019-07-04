import { SET_TIMEOUT_ID } from 'root/src/client/logic/project/actionIds'

export default timeout => ({
	type: SET_TIMEOUT_ID,
	payload: timeout,
})
