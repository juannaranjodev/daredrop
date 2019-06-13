import invokeLambda from 'root/src/shared/util/invokeLambda'
import jwtTokenSelector from 'root/src/client/logic/auth/selectors/jwtTokenSelector'
import { apiFunctionArn, apiLongTaskFunctionArn } from 'root/cfOutput'
import isLongRunningTaskSelector from 'root/src/client/logic/api/selectors/isLongRunningTaskSelector'
import { ternary } from 'root/src/shared/util/ramdaPlus'

export default (endpointId, payload, state) => {
	const jwtToken = jwtTokenSelector(state)
	const lambdaPayload = {
		endpointId,
		payload,
		...(jwtToken ? { authentication: jwtToken } : {}),
	}

	const apiFunction = ternary(isLongRunningTaskSelector(endpointId),
		apiLongTaskFunctionArn, apiFunctionArn)

	return invokeLambda(apiFunction, lambdaPayload)
}
