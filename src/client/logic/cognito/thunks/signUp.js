import { test } from 'ramda'
import userPool from 'root/src/client/logic/cognito/util/userPool'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import { VERIFY_ACCOUNT_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'
import { emailRe } from 'root/src/shared/util/regexes'

export default ({ email, password }) => dispatch => new Promise(
	(resolve, reject) => {
		if (!test(emailRe, email)) {
			const fieldError = {
				email: 'Please input correct email address.',
			}
			reject(fieldError)
		} else {
			userPool.signUp(
				email, password, [], null, (cognitoError, result) => {
					if (cognitoError) {
						const { code, message } = cognitoError
						let fieldError = { email: message }
						if (code === 'InvalidPasswordException') {
							fieldError = {
								password: 'Password must contain at least one number, symbol, and uppercase character',
							}
						}
						reject(fieldError)
					} else {
						resolve(result.user)
					}
				},
			)
		}
	},
).then(
	() => dispatch(pushRoute(VERIFY_ACCOUNT_ROUTE_ID)),
)
