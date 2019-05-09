export default {
	type: 'object',
	properties: {
		currentPage: { type: 'integer' },
		gameId: { type: 'string' },
		streamerId: { type: 'string' },
	},
	required: ['currentPage'],
	additionalProperties: false,
}
