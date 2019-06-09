import paypalClient from 'root/src/server/api/paypalClient'
import { path } from 'ramda'

export default authorization => new Promise(async (resolve, reject) => {
	const ppClientAuthorizedSDK = await paypalClient
	ppClientAuthorizedSDK.authorization.capture(path(['result', 'id'], authorization), (error, order) => {
		if (error) {
			console.log(JSON.stringify(error, null, 2))
			reject(error)
		}
		console.log(JSON.stringify(order, null, 2))
		resolve(parseFloat(path(['result', 'seller_receivable_breakdown', 'net_amount', 'value'], order)) * 100)
	})
})
