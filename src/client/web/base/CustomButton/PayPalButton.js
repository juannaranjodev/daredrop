import { PayPalButton } from 'react-paypal-button-v2'
import React, { memo } from 'react'

const PayPalButtonUnconnected = memo(({
	props: {
		payPalCreateOrder, payPalOnApprove,
	},
	customSubmitsData,
}) => (
	<PayPalButton
		createOrder={(data, actions) => payPalCreateOrder(data, actions, customSubmitsData)}
		onApprove={(data, actions) => payPalOnApprove(data, actions, customSubmitsData)}
		options={{
			clientId: PAYPAL_CLIENT_ID,
			intent: 'authorize',
		}}
		style={{
			color: 'white',
			layout: 'horizontal',
			shape: 'pill',
			label: 'paypal',
			tagline: false,
		}}
	/>
))

export default PayPalButtonUnconnected
