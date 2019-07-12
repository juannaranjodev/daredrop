import { path, toLower, not, equals } from 'ramda'

export default async (event) => {
	const userEmail = path(['request', 'userAttributes', 'email'], event)
	if (not(equals(toLower(userEmail), userEmail))) {
		return [new Error('Email address has to be lowercase'), event]
	}
	return [null, event]
}
