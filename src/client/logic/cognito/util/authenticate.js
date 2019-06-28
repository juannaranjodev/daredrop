import { CognitoUserPool, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js'
import setAwsConfig from 'root/src/client/logic/cognito/util/setAwsConfig'
import userPool from 'root/src/client/logic/cognito/util/userPool'

export const getCognitoUser = (email) => new CognitoUser({Pool: userPool, Username: email })

export const getCurrentUser = () => userPool.getCurrentUser()

export const getCurrentSession = () => new Promise((resolve, reject) => {
	const user  = getCurrentUser()
	if (!user) reject(null)
	user.getSession((err, result) => {
		if (err) reject(err)
		resolve(result)
	})
})

export const getRefreshToken = (session) => session.getRefreshToken()

export const setRefreshSession = async () => {
	try {
		const session = await getCurrentSession()
		const refreshToken = session.getRefreshToken()
		const newSession = await refreshSessionCognito(refreshToken)
		await setAwsConfig(session)
		return true		
	} catch (error) {
		return false
	}
}

const refreshSessionCognito = (refreshToken) => new Promise((resolve, reject) => {
	console.log(refreshToken)
	getCurrentUser().refreshSession(refreshToken, (err, session) => {
		if (err) reject(err)
		resolve(session)
	})		
})