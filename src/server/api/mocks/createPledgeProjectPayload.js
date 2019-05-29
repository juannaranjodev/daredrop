export default projectId => ({
	projectId,
	pledgeAmount: 1234,
	paymentInfo: {
		paymentType: 'stripeCard',
		paymentId: 'mockStripeCardId',
	},
})
