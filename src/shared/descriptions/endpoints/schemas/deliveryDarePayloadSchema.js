export default {
	type: 'object',
	properties: {
		videoAtach: {
			type: 'object',
			properties: {
				name: { type: 'string' },
				data: { type: 'string' },
			},
		},
		videoURL: { type: 'string' },
		timeStamp: { type: 'string' },
	},
	required: ['token'],
	additionalProperties: false,
}
