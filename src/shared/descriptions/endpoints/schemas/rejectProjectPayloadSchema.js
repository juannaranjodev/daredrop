export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		message: {
			type: 'string',
			maxLength: 300,
			errorMessage: {
				maxLength: '300 characters max.',
			},
		},
		assigneeId: { type: 'string' },
	},
	required: ['projectId'],
	additionalProperties: false,
}
