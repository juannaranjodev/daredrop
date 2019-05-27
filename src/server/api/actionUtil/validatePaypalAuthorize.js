import checkoutNodeJssdk from '@paypal/checkout-server-sdk'
import paypalClient from 'root/src/server/api/paypalClient'
import { pathOr, equals, not, lt, gt, anyPass } from 'ramda'

export default async (orderID, pledgeAmount) => {
	try {
		const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID)
		const ppClientAuthorized = await paypalClient
		const order = await ppClientAuthorized.execute(request)
		const { statusCode } = order
		if (anyPass([
			lt(statusCode, 200),
			gt(statusCode, 300),
			not(equals(parseInt(pathOr('0', ['result', 'purchase_units', 0, 'amount', 'value'], order), 10), pledgeAmount)),
		])) {
			return false
		}
		return true
	} catch (err) {
		return false
	}
}
