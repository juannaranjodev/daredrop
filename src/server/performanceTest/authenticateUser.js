import userPool from 'root/src/server/performanceTest/cognitoUserPool'

import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js-node'

const AuthenticateUserError = reject => (error) => {
	const { code, message } = error
	let fieldError = { password: message }
	if (code === 'UserNotFoundException') {
		fieldError = { email: message }
	}
	reject(fieldError)
}

export default ({ email, password }) => new Promise(
	(resolve, reject) => {
		const authenticationDetails = new AuthenticationDetails({
			Username: email,
			Password: password,
		})
		const cognitoUser = new CognitoUser({
			Username: email,
			Pool: userPool,
		})
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: resolve,
			onFailure: AuthenticateUserError(reject),
		})
	},
).then(session => session).catch((err) => {
	throw err
})
