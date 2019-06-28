export default {
	type: 'object',
	properties: {
		email: {
			type: 'string',
			format: 'email',
		},
		verificationCode: {
			type: 'string',
		},
	},
	required: ['email', 'verificationCode'],
	errorMessage: {
		properties: {
			verificationCode: 'Verification code is required',
		},
	},
	additionalProperties: false,
}
