import stripeClient from 'root/src/server/api/stripeClient'

export default async (sourceId) => {
	const stripe = await stripeClient
	try {
		const source = await stripe.sources.retrieve(sourceId)
		console.log(source)
		if (!source) {
			console.log('stripe1')
			return false
		}
	} catch (err) {
		console.log('stripe2')
		return false
	}
	console.log('stripe no err')
	return true
}
