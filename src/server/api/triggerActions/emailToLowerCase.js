import { path, toLower, not, equals } from 'ramda'

export default async (event) => {
	const userEmail = path(['request', 'userAttributes', 'email'], event)
	if (not(equals(toLower(userEmail), userEmail))) {
		console.log(toLower(userEmail))
		console.log(userEmail)
		console.log(equals(toLower(userEmail), userEmail))
		return [new Error({ message: 'Email address has to be lowercase' }), event]
	}
	return [null, event]
}
