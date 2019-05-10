export default {
	type: 'object',
	properties: {
		currentPage: { type: 'integer' },
		filter:{
			type: 'array',
			items:{
				type:'object',
				properties: {
					param: { type: 'string' },
					value: { type: 'string' },
				},
			}
		},
		sortType: { type: 'string' },
	},
	required: ['currentPage'],
	additionalProperties: false,
}
