import { head } from 'ramda'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { REJECT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewUserDataChild, viewUserData } = apiStoreLenses

export default message => async (dispatch, getState) => {
	const state = getState()
	const tokenId = head(Object.keys(viewUserData(state)))
	const projectId = currentRouteParamsRecordId(state)
	// TUTAJ SK
	const userData = viewUserDataChild(tokenId, state)
	const assigneeId = userData.sk
	let apiPayload
	if (message) {
		apiPayload = {
			projectId,
			assigneeId,
			message,
		}
	} else {
		apiPayload = {
			projectId,
			assigneeId,
		}
		return dispatch(apiRequest(REJECT_PROJECT, apiPayload))
	}
}
