import { map, and, gte, lt } from 'ramda'
import { stripeCard, paypalAuthorize } from 'root/src/shared/constants/paymentTypes'
import capturePaypalAuthorize from 'root/src/server/api/actionUtil/capturePaypalAuthorize'
import captureStripeAuthorize from 'root/src/server/api/actionUtil/captureStripeAuthorize'
import calculatePaypalPayment from 'root/src/server/api/actionUtil/calculatePaypalPayment'
import calculateStripePayment from 'root/src/server/api/actionUtil/calculateStripePayment'

export default paymentsArr => Promise.all(map(async (payment) => {
	const { paymentType, paymentId, captured, paymentAmount } = payment
	if (and(gte(captured, 200), lt(captured, 300))) {
		return payment
	}
	try {
		let captureFn
		let calculateFn
		switch (paymentType) {
			case stripeCard:
				captureFn = captureStripeAuthorize
				calculateFn = calculateStripePayment
				break
			case paypalAuthorize:
				captureFn = capturePaypalAuthorize
				calculateFn = calculatePaypalPayment
				break
			default:
				throw new Error('Payment type not found')
		}
		const authorization = await captureFn(paymentId, paymentAmount)
		const transactionNet = await calculateFn(authorization)
		return { ...payment, transactionNet, captured: authorization.httpStatusCode || 200 }
	} catch (err) {
		return { ...payment, captured: err.statusCode || err.httpStatusCode, message: err.message }
	}
}, paymentsArr))
