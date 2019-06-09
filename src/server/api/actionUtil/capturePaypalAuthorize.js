
import paypalClient from 'root/src/server/api/paypalClient'

export default paypalAuthorizeId => new Promise(async (resolve, reject) => {
	const ppClientAuthorizedSDK = await paypalClient
	ppClientAuthorizedSDK.authorizations.capture(paypalAuthorizeId, (error, capture) => {
		if (error) {
			console.log(JSON.stringify(error, null, 2))
			reject(error)
		}
		console.log(JSON.stringify(capture, null, 2))
		resolve(capture)
	})
})
