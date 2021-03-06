import {
	projectApprovedKey, projectRejectedKey, projectPendingKey,
} from 'root/src/shared/descriptions/apiLenses'

export default {
	type: 'object',
	properties: {
		id: { type: 'string' },
		title: { type: 'string' },
		image: { type: 'string' },
		description: { type: 'string' },
		favoritesAmount: { type: 'integer' },
		pledgers: { type: 'integer' },
		myPledge: { type: 'integer' },
		myFavorites: { type: 'integer' },
		approved: { type: 'string' },
		created: { type: 'string' },
		approvedVideoUrl: { type: 'string' },
		pledgeAmount: { type: 'integer' },
		status: {
			type: 'string',
			enum: [projectApprovedKey, projectRejectedKey, projectPendingKey],
		},
		assignees: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					platform: {
						type: 'string',
						enum: ['twitch', 'youtube'],
					},
					image: { type: 'string' },
					description: { type: 'string' },
					platformId: { type: 'string' },
					displayName: { type: 'string' },
					amountRequested: { type: 'integer' },
					username: { type: 'string' },
				},
				required: ['platform', 'image', 'platformId'],
				additionalProperties: false,
			},
		},
		games: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: { type: 'string' },
					boxArtTemplateUrl: { type: 'string' },
				},
				required: ['name', 'boxArtTemplateUrl'],
				additionalProperties: false,
			},
		},
		deliveries: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					videoURL: { type: 'string' },
					s3ObjectURL: { type: 'string' },
					timeStamp: { type: 'string' },
					youTubeURL: { type: 'string' },
				},
				required: ['videoURL', 's3ObjectURL', 'timeStamp'],
				additionalProperties: true,
			},
		},
		userRejectedDare: { type: 'boolean' },
	},
	required: ['id', 'title', 'image', 'description', 'pledgeAmount', 'status', 'favoritesAmount'],
	additionalProperties: false,
}
