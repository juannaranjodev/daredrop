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
		stripeCardId: { type: 'string' },
		paymentInfo: {
			type: 'object',
			properties: {
				created: { type: 'string' },
				email: { type: 'string' },
				name: { type: 'string' },
				paymentAuthorization: {
					type: 'object',
					properties: {
						amount: {
							value: { type: 'string' },
							currency_code: { type: 'string' },
						},
						id: { type: 'string' },
						seller_protection: { type: 'object' },
						status: { type: 'string' },
					},
				},
			},
		},
	},
	required: ['pledgeAmount'],
	additionalProperties: false,
}
