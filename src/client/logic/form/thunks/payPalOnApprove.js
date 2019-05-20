export default (data, actions) => actions.order.capture().then(details => fetch('/paypal-transaction-complete', {
	method: 'post',
	body: JSON.stringify({
		orderID: data.orderID,
	}),
}))
