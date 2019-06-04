import { UPLOAD_PROGRESS } from 'root/src/client/logic/project/actionIds'

export default progressEvent => ({
	type: UPLOAD_PROGRESS,
	payload: { progressEvent },
})
