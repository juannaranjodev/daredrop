import stripeClient from 'root/src/server/api/stripeClient'

export default stripeAuthorizeId => new Promise(async (resolve, reject) => {
	try {
		const stripe = await stripeClient
		const capture = await stripe.charges.capture(stripeAuthorizeId)
		resolve(capture)
	} catch (err) {
		reject(err)
	}
})
