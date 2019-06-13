import { paypalAuthorize, stripeCard } from 'root/src/shared/constants/paymentTypes'

export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		pledgeAmount: {
			type: 'integer',
			minimum: 5,
			maximum: 999999,
			errorMessage: {
				minimum: 'Pledge amount must be at least $5.',
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
	},
	required: ['pledgeAmount', 'paymentInfo'],
	additionalProperties: false,
}
