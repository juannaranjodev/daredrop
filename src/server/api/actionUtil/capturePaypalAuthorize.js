
import paypalClient from 'root/src/server/api/paypalClient'

export default (paypalAuthorizeId, paymentAmount) => new Promise(async (resolve, reject) => {
	const ppClientAuthorized = await paypalClient()
	ppClientAuthorized.authorization.capture(
		paypalAuthorizeId,
		{
			amount: {
				currency: 'USD',
				total: paymentAmount,
			},
			is_final_capture: true,
		},
		(error, capture) => {
			if (error) {
				reject(error)
			}
			resolve(capture)
		},
	)
})
