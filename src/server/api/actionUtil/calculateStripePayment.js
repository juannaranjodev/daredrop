import { prop } from 'ramda'
import stripeClient from 'root/src/server/api/stripeClient'

export default async (authorization) => {
	const balanceId = prop('balance_transaction', authorization)
	const stripe = await stripeClient
	const balance = await stripe.balanceTransactions.retrieve(balanceId)
	return prop('net', balance)
}
