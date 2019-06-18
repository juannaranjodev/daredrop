import { ADD_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'

export default params => ({
	type: ADD_FILTER_PARAMS,
	payload: params,
})
