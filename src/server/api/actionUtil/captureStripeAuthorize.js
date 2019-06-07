import stripeClient from 'root/src/server/api/stripeClient'

export default stripeAuthorizeId => new Promise(async (resolve, reject) => {
	try {
		const stripe = await stripeClient
		const capture = await stripe.charges.capture(stripeAuthorizeId)
		console.log(capture)
		console.log('here')
		console.log('here')
		console.log('here')
		resolve(capture)
	} catch (err) {
		console.log(err)
		console.log(err)
		console.log(err)
		reject(err)
	}
})
