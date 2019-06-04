import Stripe from 'stripe'
import { stripeSecret } from 'root/src/shared/constants/stripeSecret'

const stripe = Stripe(stripeSecret)

export default async(amount, sourceId) => {
  let result;
  try {
    const charge = await stripe.charges.create({
      capture: false,
      currency: 'usd',
      source: sourceId,
      amount
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
