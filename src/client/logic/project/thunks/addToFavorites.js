import { equals } from 'ramda'
import { idProp } from 'root/src/client/logic/api/lenses'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import { ADD_TO_FAVORITES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'
import invokeApiLambda from 'root/src/client/logic/api/util/invokeApiLambda'

import initApiRecordRequest from 'root/src/client/logic/api/actions/initApiRecordRequest'
import apiRecordRequestSuccess from 'root/src/client/logic/api/actions/apiRecordRequestSuccess'
import apiRecordRequestError from 'root/src/client/logic/api/actions/apiRecordRequestError'

import favoritesProcessingStart from 'root/src/client/logic/project/actions/favoritesProcessingStart'
import favoritesProcessingEnd from 'root/src/client/logic/project/actions/favoritesProcessingEnd'

export default () => async (dispatch, getState) => {
	const state = getState()

	const projectId = currentRouteParamsRecordId(state)
	const payload = {
		projectId,
	}

	// set the favorites button loading
	dispatch(favoritesProcessingStart())

	const recordType = project
	const recordId = idProp(payload)
	if (recordId) { // else creating, don't need record loading state
		const recordStoreKey = createRecordStoreKey(recordType, recordId)
		dispatch(initApiRecordRequest(recordStoreKey))
	}
	const lambdaRes = await invokeApiLambda(ADD_TO_FAVORITES, payload, state)
	const { statusCode, body, statusError, generalError } = lambdaRes
	if (equals(statusCode, 200)) {
		dispatch(apiRecordRequestSuccess(recordType, body))
		dispatch(favoritesProcessingEnd())
	} else if (recordId) { // else creating, don't need record error state
		const error = { ...statusError, ...generalError }
		dispatch(apiRecordRequestError(recordType, recordId, error))
		dispatch(favoritesProcessingEnd())
	}

	return lambdaRes
}
