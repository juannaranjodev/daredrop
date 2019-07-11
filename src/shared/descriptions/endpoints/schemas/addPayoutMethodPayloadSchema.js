export default {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'Email' },
		method: { type: 'string' },
	},
	additionalProperties: false,
	required: ['email'],
}
