import { head, equals, prop, hasPath, or, not } from 'ramda'

export default async (event, context, callback) => {
	const { request } = prop('cf', head(prop('Records', event)))
	const { headers } = request
	const user = 'daredropdev'
	const pw = 'pubGI$#1!'
	const authString = `Basic ${user}:${pw}`.toString('base64')
	if (or(
		not(hasPath(['authorization'], headers)),
		not(equals(
			prop('value', head(prop('authorization', headers))),
			authString,
		)),
	)) {
		const response = {
			status: '401',
			statusDescription: 'Unauthorized',
			body: 'Unauthorized',
			headers: {
				'www-authenticate': [{ key: 'WWW-Authenticate', value: 'Basic' }],
			},
		}
		callback(null, response)
	}

	// User has authenticated
	callback(null, request)
}
