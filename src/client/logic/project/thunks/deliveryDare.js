import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { DELIVER_DARE_SUCCESS_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import ajax from 'root/src/shared/util/ajax'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

export default (
	{ videoAttach: { file } },
	{ body: { url, deliverySortKey } },
) => async (dispatch, getState) => {
	const state = getState()
	const projectId = currentRouteParamsRecordId(state)
	const uploadParams = {
		url,
		method: 'PUT',
		file,
		headers: {
			'Content-Type': 'video',
		},
	}
	await ajax(uploadParams, dispatch, state)
	const apiPayload = {
		projectId,
		deliverySortKey,
	}
	await dispatch(apiRequest(DELIVERY_DARE, apiPayload))
	return dispatch(pushRoute(DELIVER_DARE_SUCCESS_ROUTE_ID, { recordId: projectId }))
}
