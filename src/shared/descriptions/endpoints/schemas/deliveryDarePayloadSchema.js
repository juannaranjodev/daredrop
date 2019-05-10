export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		deliverySortKey: { type: 'string' },
	},
	required: ['projectId', 'deliverySortKey'],
	additionalProperties: false,
}
