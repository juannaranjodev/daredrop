import { paypalAuthorize, stripeCard } from 'root/src/shared/constants/paymentTypes'

export default {
	type: 'object',
	properties: {
		streamerUrl: { type: 'string' },
		title: {
			type: 'string',
			maxLength: 60,
			errorMessage: {
				maxLength: 'Title must be at most 60 characters',
			},
		},
		description: { type: 'string' },
		games: {
			type: 'array',
			minItems: 1,
			maxItems: 1,
			uniqueItems: true,
			items: {
				type: 'object',
				properties: {
					id: { type: 'integer' },
				},
				required: ['id'],
			},
		},
		assignees: {
			type: 'array',
			minItems: 1,
			maxItems: 10,
			uniqueItems: true,
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'integer',
						// format: 'url',
						// pattern: '(twitch\.tv)|(youtube\.com)',
						// pattern: '(twitch\.tv)',
					},
				},
				required: ['id'],
			},
			errorMessage: {
				maxItems: 'You may only add 10 streamers.',
			},
		},
		paymentInfo: {
			type: 'object',
			properties: {
				paymentType: {
					type: 'string',
					enum: [stripeCard, paypalAuthorize],
				},
				paymentId: { type: 'string' },
				paymentAmount: { type: 'number' },
			},
			required: ['paymentType', 'paymentId', 'paymentAmount'],
			additionalProperties: false,
		},
		pledgeAmount: { type: 'integer', minimum: 1, maximum: 999999 },
		favoritesAmount: { type: 'integer' },
		partialFormId: { type: 'string' },
	},
	required: ['title', 'games', 'paymentInfo'],
	additionalProperties: false,
}
