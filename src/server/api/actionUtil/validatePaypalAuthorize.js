/* eslint-disable prefer-promise-reject-errors */
import paypalClient from 'root/src/server/api/paypalClient'
import { path, equals, not, lt, gt } from 'ramda'

export default (paymentId, pledgeAmount) => new Promise(async (resolve, reject) => {
	const ppClientAuthorized = await paypalClient()
	ppClientAuthorized.order.get(paymentId, (error, order) => {
		if (error) {
			reject(new Error(error))
		}
		const { httpStatusCode } = order
		if (
			lt(httpStatusCode, 200) || gt(httpStatusCode, 300)
			|| not(equals(parseFloat(path(['amount', 'total'], order)), pledgeAmount))
		) {
			reject(new Error('Invalid pledge amount'))
		}
		resolve(true)
	})
})
