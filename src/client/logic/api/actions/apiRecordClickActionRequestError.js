import {
	API_RECORD_CLICK_ACTION_REQUEST_ERROR,
} from 'root/src/client/logic/api/actionIds'

export default (recordClickActionStoreKey, errors) => ({
	type: API_RECORD_CLICK_ACTION_REQUEST_ERROR,
	payload: { recordClickActionStoreKey, errors },
})
