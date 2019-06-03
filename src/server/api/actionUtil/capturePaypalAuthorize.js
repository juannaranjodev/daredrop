import checkoutNodeJssdk from '@paypal/checkout-server-sdk'
import paypalClient from 'root/src/server/api/paypalClient'

export default paypalAuthorizeId => new Promise(async (resolve, reject) => {
	const request = new checkoutNodeJssdk.payments.AuthorizationsCaptureRequest(paypalAuthorizeId)
	try {
		const ppClientAuthorized = await paypalClient
		const capture = await ppClientAuthorized.execute(request)
		resolve(capture)
	} catch (err) {
		reject(err)
	}
})
