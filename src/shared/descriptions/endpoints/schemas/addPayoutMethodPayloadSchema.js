export default {
	type: 'object',
	properties: {
		email: { type: 'string', format: 'email' },
		method: { type: 'string' },
	},
	additionalProperties: false,
	required: ['email'],
}
