export default {
	type: 'object',
	properties: {
		videoURL: {
			type: 'string',
			format: 'url',
		},
		videoAttach: {
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
	required: ['videoURL', 'videoAttach', 'timeStamp'],
	additionalProperties: false,
}
