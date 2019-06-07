import { prop, gte } from 'ramda'
import jwtDecode from 'jwt-decode'
import { SIGN_OUT, SIGN_IN } from 'root/src/shared/descriptions/routes/routeIds'
import jwtTokenSelector from 'root/src/client/logic/auth/selectors/jwtTokenSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

export default async (state, dispatch) => {
	const token = jwtTokenSelector(state)
	if (!token)
		return true
	const decodedToken = jwtDecode(token)
	const now = Math.ceil(Date.now() / 1000)
	const expiryTime = prop('exp', decodedToken)
	if (gte(now, expiryTime)) {
		dispatch(pushRoute(SIGN_OUT, { }))
		dispatch(pushRoute(SIGN_IN, { }))
		return false
	}
	return true
}