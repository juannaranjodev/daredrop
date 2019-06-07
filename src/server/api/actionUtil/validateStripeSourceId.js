import stripeClient from 'root/src/server/api/stripeClient'

export default async (sourceId) => {
	const stripe = await stripeClient
	try {
		const source = await stripe.sources.retrieve(sourceId)
		console.log(source)
		if (!source) {
			return false
		}
	} catch (err) {
		console.log(err)
		return false
	}
	return true
}
