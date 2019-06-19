import { equals, forEach, or, propOr, isNil, path, subtract, add, eg } from 'ramda'

import createListStoreKey from 'root/src/client/logic/api/util/createListStoreKey'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import { idProp } from 'root/src/client/logic/api/lenses'
import { storageGet, storageClearItem } from 'root/src/shared/util/storage'
import isOneOfAssignees from 'root/src/client/logic/api/util/isOneOfAssignees'

import initApiListRequest from 'root/src/client/logic/api/actions/initApiListRequest'
import apiListRequestSuccess from 'root/src/client/logic/api/actions/apiListRequestSuccess'
import apiListRequestError from 'root/src/client/logic/api/actions/apiListRequestError'
import setCurrentPage from 'root/src/client/logic/list/actions/setCurrentPage'
import setHasMore from 'root/src/client/logic/list/actions/setHasMore'

import initApiRecordRequest from 'root/src/client/logic/api/actions/initApiRecordRequest'
import apiRecordRequestSuccess from 'root/src/client/logic/api/actions/apiRecordRequestSuccess'
import apiRecordRequestError from 'root/src/client/logic/api/actions/apiRecordRequestError'

import apiExternalRequestSuccess from 'root/src/client/logic/api/actions/apiExternalRequestSuccess'
import apiExternalRequestError from 'root/src/client/logic/api/actions/apiExternalRequestError'

import apiFetchUserDataSuccess from 'root/src/client/logic/api/actions/apiFetchUserDataSuccess'

import recordTypeSelector from 'root/src/client/logic/api/selectors/recordTypeSelector'
import endpointTypeSelector from 'root/src/client/logic/api/selectors/endpointTypeSelector'

import invokeApiLambda from 'root/src/client/logic/api/util/invokeApiLambda'
import invokeApiExternal from 'root/src/client/logic/api/util/invokeApiExternal'

import matchPath from 'root/src/client/logic/route/util/matchPath'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

import endpointMappings from 'root/src/client/logic/api/util/endpointMappings'
import determineToken from 'root/src/client/logic/api/util/determineToken'
import checkTokenExpire from 'root/src/client/logic/api/util/checkTokenExpire'
import { TWITCH_OAUTH_FAILURE_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

export const fetchList = async (dispatch, state, endpointId, payload, getState) => {
	const recordType = recordTypeSelector(endpointId)
	const listStoreKey = createListStoreKey(endpointId, payload)
	await checkTokenExpire(state, dispatch)
	dispatch(initApiListRequest(listStoreKey))
	const lambdaRes = await invokeApiLambda(endpointId, payload, state)
	const { statusCode, body, statusError, generalError } = lambdaRes
	if (equals(statusCode, 200)) {
		dispatch(apiListRequestSuccess(listStoreKey, recordType, body))
		if (payload.currentPage >= body.allPage) {
			dispatch(setHasMore(false))
		} else {
			dispatch(setHasMore(true))
		}
		if (equals(payload.currentPage, 1)) dispatch(setCurrentPage(payload.currentPage))
		else if (equals(add(path(['list', 'currentPage'], getState()), 1), payload.currentPage)) {
			dispatch(setCurrentPage(add(path(['list', 'currentPage'], getState()), 1)))
		}
	} else {
		const error = { ...statusError, ...generalError }
		dispatch(apiListRequestError(listStoreKey, error))
	}
	return lambdaRes
}

export const fetchRecord = async (dispatch, state, endpointId, payload, getState) => {
	const recordType = recordTypeSelector(endpointId)
	const recordId = idProp(payload)
	await checkTokenExpire(state, dispatch)
	if (recordId) { // else creating, don't need record loading state
		const recordStoreKey = createRecordStoreKey(recordType, recordId)
		dispatch(initApiRecordRequest(recordStoreKey))
	}
	const lambdaRes = await invokeApiLambda(endpointId, payload, state)
	const { statusCode, body, statusError, generalError } = lambdaRes
	if (equals(statusCode, 200)) {
		dispatch(apiRecordRequestSuccess(recordType, body))
	} else if (recordId) { // else creating, don't need record error state
		const error = { ...statusError, ...generalError }
		dispatch(apiRecordRequestError(recordType, recordId, error))
	}

	return lambdaRes
}

export const fetchExternal = async (dispatch, state, endpointId, payload, getState) => {
	try {
		await checkTokenExpire(state, dispatch)
		const externalRes = await invokeApiExternal(endpointId, payload)
		externalRes.tokenId = determineToken(endpointId)
		const lambdaEndpoint = endpointMappings(endpointId, payload)
		const lambdaRes = await invokeApiLambda(lambdaEndpoint, externalRes, state)
		const { status, displayName } = externalRes

		if (or(equals(status, 200), displayName)) {
			const redirectUri = propOr(undefined, 'value', storageGet('redirectUri'))
			const redirectAssignees = propOr(undefined, 'value', storageGet('redirectAssignees'))
			let isAssignee
			if (redirectAssignees) {
				isAssignee = isOneOfAssignees(externalRes.displayName, JSON.parse(redirectAssignees))
			}
			if (redirectUri && isAssignee) {
				const { routeId, routeParams } = matchPath(redirectUri)
				dispatch(pushRoute(routeId, routeParams))
				dispatch(apiExternalRequestSuccess(endpointId, lambdaRes, false))
			} else if (redirectUri && !isAssignee) {
				dispatch(apiExternalRequestSuccess(endpointId, lambdaRes, true))
			} else {
				dispatch(apiExternalRequestSuccess(endpointId, lambdaRes, false))
			}
			storageClearItem('redirectUri')
			storageClearItem('redirectAssignees')
		}
		return externalRes
	} catch (error) {
		console.log(error)
		dispatch(pushRoute(TWITCH_OAUTH_FAILURE_ROUTE_ID))
		dispatch(apiExternalRequestError(error))
		return error
	}
}

export const fetchUserData = async (dispatch, state, endpointId, payload, getState) => {
	const recordType = recordTypeSelector(endpointId)
	await checkTokenExpire(state, dispatch)
	const lambdaRes = await invokeApiLambda(endpointId, payload, state)
	if (lambdaRes.body.length > 0) {
		forEach((res) => {
			const recordStoreKey = createRecordStoreKey(endpointId, (`${res.pk}-${res.sk}`))
			dispatch(apiFetchUserDataSuccess(recordStoreKey, recordType, res))
		}, lambdaRes.body)
	} else {
		// TODO
	}
	return lambdaRes
}

const endpointTypeFunctionMap = {
	list: fetchList,
	record: fetchRecord,
	external: fetchExternal,
	userData: fetchUserData,
}

export default (endpointId, payload) => async (dispatch, getState) => {
	if (!isNil(endpointId)) {
		try {
			const state = getState()
			const endpointType = endpointTypeSelector(endpointId)
			return endpointTypeFunctionMap[endpointType](
				dispatch, state, endpointId, payload, getState,
			)
		} catch (e) {
			console.warn(e)
		}
	}
}
