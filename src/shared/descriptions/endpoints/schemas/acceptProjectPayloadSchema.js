export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		amountRequested: {
			type: 'number',
		},
	},
	required: ['projectId', 'amountRequested'],
	additionalProperties: false,
}
