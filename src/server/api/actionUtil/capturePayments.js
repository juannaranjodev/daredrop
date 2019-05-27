import { map, and, gte, lt } from 'ramda'
import { stripeCard, paypalAuthorize } from 'root/src/shared/constants/paymentTypes'
import capturePaypalAuthorize from 'root/src/server/api/actionUtil/capturePaypalAuthorize'

export default paymentsArr => Promise.all(map(async (payment) => {
	const { paymentType, paymentId, captured } = payment
	if (and(gte(captured, 200), lt(captured, 300))) {
		return payment
	}
	try {
		switch (paymentType) {
			case stripeCard:
				// stripe capture
				console.log(paymentType)
				return 'x'
			case paypalAuthorize:
				const authorization = await capturePaypalAuthorize(paymentId)
				return { ...payment, captured: authorization.statusCode }
			default:
				return { ...payment, message: 'Default case from capturePayments' }
		}
	} catch (err) {
		return { ...payment, captured: err.statusCode, message: err.message }
	}
}, paymentsArr))
