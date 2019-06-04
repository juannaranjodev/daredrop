import { multiply } from 'ramda'
import Stripe from 'stripe'
import { stripeSecret } from 'root/src/shared/constants/stripeSecret'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import findOrCreateStripeCustomer from 'root/src/server/api/actionUtil/findOrCreateStripeCustomer'


export default async(amount, sourceId, userId) => {
  const stripe = Stripe(stripeSecret)
  const email = await getUserEmail(userId)
  const customerId = await findOrCreateStripeCustomer(email, sourceId)
  let result;
  try {
    const charge = await stripe.charges.create({
      capture: false,
      currency: 'usd',
      source: sourceId,
      customer: customerId,
      amount: multiply(amount, 100)
    })
    result = {
      authorized: true, 
      id: charge.id
    }
  } catch (error) {
    result = {
      authorized: true, 
      error
    }
  }
  return result
}
