export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		audit: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['projectId', 'audit'],
	additionalProperties: false,
}
