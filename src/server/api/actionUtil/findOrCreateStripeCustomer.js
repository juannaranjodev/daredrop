import { isEmpty, head, prop, propEq, filter } from 'ramda'
import stripeClient from 'root/src/server/api/stripeClient'

export default async (email, sourceId) => {
	try {
		const stripe = await stripeClient()
		const customerList = await stripe.customers.list({ email })
		let customer
		if (isEmpty(prop('data', customerList))) {
			customer = await stripe.customers.create({ source: sourceId, email })
		} else {
			customer = head(prop('data', customerList))
			const sources = prop('data', prop('sources', customer))
			if (isEmpty(filter(propEq('id', sourceId), sources))) {
				await stripe.customers.createSource(prop('id', customer), { source: sourceId })
			}
		}
		return prop('id', customer)
	} catch (err) {
		return err
	}
}
