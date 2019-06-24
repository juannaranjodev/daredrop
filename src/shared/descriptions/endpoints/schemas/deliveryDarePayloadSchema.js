export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		deliverySortKey: { type: 'string' },
		...(process.env.STAGE === 'testing'
			? { testName: { type: 'string' } } : {}),
	},
	required: ['projectId', 'deliverySortKey'],
	additionalProperties: false,
}
