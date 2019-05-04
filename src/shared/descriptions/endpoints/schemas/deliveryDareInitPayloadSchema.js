export default {
	type: 'object',
	properties: {
		videoName: { type: 'string' },
		videoURL: { type: 'string' },
		timeStamp: { type: 'string' },
		projectId: { type: 'string' },
	},
	required: ['videoName', 'videoURL', 'timeStamp', 'projectId'],
	additionalProperties: false,
}
