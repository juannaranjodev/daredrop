export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['projectId', 'message'],
	additionalProperties: false,
}
