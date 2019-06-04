import { isEmpty, head, prop, propEq, find } from 'ramda'
import Stripe from 'stripe'
import { stripeSecret } from 'root/src/shared/constants/stripeSecret'

const stripe = Stripe(stripeSecret)

export default async (email, sourceId) => {
	const customerList = await stripe.customers.list({ email })
	let customer;
	if (isEmpty(prop('data', customerList))) {
		customer = await stripe.customers.create({ source: sourceId, email })
	} else {
		customer = head(prop('data', customerList))
		const sources = prop('data', prop('sources', customer))
		if (isEmpty(find(propEq('id', sourceId))(sources))){
			await stripe.customers.createSource(prop('id', customer), { source: sourceId })
		}
	}
	return prop('id', customer)
}