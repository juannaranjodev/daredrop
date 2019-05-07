import { set, lensProp, path } from 'ramda'

import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'

import { CREATE_PROJECT, ADD_PAYMENT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default formData => async (dispatch) => {
	let { stripeCardId } = formData
	if (typeof stripeCardId === 'object') {
		const stripeRes = await stripeCardId.createSource({
			type: 'card', usage: 'reusable', currency: 'usd',
		})
		const addPaymentPayload = {
			stripeCardId: stripeRes.source.id,
			brand: stripeRes.source.card.brand,
			lastFour: stripeRes.source.card.last4,
			expMonth: stripeRes.source.card.exp_month,
			expYear: stripeRes.source.card.exp_year,
		}
		dispatch(apiRequest(ADD_PAYMENT_METHOD, addPaymentPayload))
		stripeCardId = stripeRes.source.id
	}
	const apiPayload = set(
		lensProp('stripeCardId'),
		path(['source', 'id'], stripeCardId),
		formData,
	)
	return dispatch(apiRequest(CREATE_PROJECT, apiPayload))
}
