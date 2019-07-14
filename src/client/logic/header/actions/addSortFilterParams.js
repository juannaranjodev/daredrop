import { ADD_SORT_FILTER_PARAMS } from 'root/src/client/logic/header/actionsIds'

export default (moduleId, params) => ({
	type: ADD_SORT_FILTER_PARAMS,
	payload: { moduleId, params },
})
