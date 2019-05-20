import { PayPalButton } from 'react-paypal-button-v2'
import React, { memo } from 'react'
import payPalCreateOrder from 'root/src/client/logic/form/thunks/payPalCreateOrder'
import payPalOnApprove from 'root/src/client/logic/form/thunks/payPalOnApprove'

const PayPalButtonUnconnected = memo(({ cashAmount, ...asda }) => (
	<PayPalButton
		createOrder={(data, actions) => payPalCreateOrder(data, actions, cashAmount)}
		onApprove={(data, actions) => payPalOnApprove(data, actions)}
		options={{
			clientId: PAYPAL_CLIENT_ID,
		}}
		onClick={() => console.log(asda)}
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
