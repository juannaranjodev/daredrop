export default {
	type: 'object',
	properties: {
		videoURL: {
			type: 'string',
			format: 'url',
		},
		videoAtach: {
			type: 'object',
			properties: {
				data: {
					type: 'string',
				},
				name: {
					type: 'string',
				},
			},
		},
		timeStamp: {
			type: 'string',
			format: 'time',
		},
	},
	required: ['videoURL', 'videoAtach', 'timeStamp'],
	additionalProperties: false,
}
