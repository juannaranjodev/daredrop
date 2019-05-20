import { toString } from 'ramda'

export default (data, actions, cashAmount) => actions.order.create({
	purchase_units: [{
		amount: {
			currency_code: 'USD',
			value: toString(cashAmount),
		},
	}],
})
