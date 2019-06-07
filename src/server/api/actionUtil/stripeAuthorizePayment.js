import { multiply } from 'ramda'
import stripeClient from 'root/src/server/api/stripeClient'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import findOrCreateStripeCustomer from 'root/src/server/api/actionUtil/findOrCreateStripeCustomer'


export default async (amount, sourceId, userId) => {
	const stripe = await stripeClient
	const email = await getUserEmail(userId)
	let result
	try {
		const customerId = await findOrCreateStripeCustomer(email, sourceId)
		const charge = await stripe.charges.create({
			capture: false,
			currency: 'usd',
			source: sourceId,
			customer: customerId,
			amount: multiply(amount, 100),
		})
		result = {
			authorized: true,
			id: charge.id,
		}
	} catch (error) {
		result = {
			authorized: false,
			error,
		}
	}
	return result
}
