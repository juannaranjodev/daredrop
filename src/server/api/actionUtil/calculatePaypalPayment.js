import paypalClient from 'root/src/server/api/paypalClient'
import checkoutNodeJssdk from '@paypal/checkout-server-sdk'
import { path } from 'ramda'

export default async (authorization) => {
	const ppClientAuthorized = await paypalClient.checkout
	const request = new checkoutNodeJssdk.payments.CapturesGetRequest(path(['result', 'id'], authorization))
	const authorizationDetails = await ppClientAuthorized.execute(request)
	return parseFloat(path(['result', 'seller_receivable_breakdown', 'net_amount', 'value'], authorizationDetails), 10) * 100
}
