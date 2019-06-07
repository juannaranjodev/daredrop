import { CognitoUser } from 'amazon-cognito-identity-js'

import userPool from 'root/src/client/logic/cognito/util/userPool'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import { LOGIN_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { SUCCESS_VERIFY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default ({ email, verificationCode }) => dispatch => new Promise(
	(resolve, reject) => {
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})
		cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
			if (err) {
				reject(err)
			} else {
				resolve(result)
			}
		})
	}
).then(
	() => {
		dispatch(apiRequest(SUCCESS_VERIFY, { email: email }))
		dispatch(pushRoute(LOGIN_ROUTE_ID))
	}
).catch(
	console.warn
)
