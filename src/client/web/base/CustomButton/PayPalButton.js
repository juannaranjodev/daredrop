/* eslint-disable max-len */
import { PayPalButton } from 'react-paypal-button-v2'
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import withModuleContext from 'root/src/client/util/withModuleContext'
import buttonConnector from 'root/src/client/logic/form/connectors/buttonConnector'
import { orNull } from 'root/src/shared/util/ramdaPlus'

const styles = {
}


const PayPalButtonUnconnected = memo(({
	moduleKey, payPalCreateOrder, payPalOnApprove, payPalOnError,
	customSubmitsData, submitIndex, buttonErrorTip, classes,
}) => (
	<div>
		{orNull(
			buttonErrorTip,
			<div>
				{'This is error'}
			</div>,
		)}
		<PayPalButton
			createOrder={(data, actions) => payPalCreateOrder(data, actions, { ...customSubmitsData, submitIndex })}
			onApprove={(data, actions) => payPalOnApprove(data, actions, { ...customSubmitsData, submitIndex })}
			onError={err => payPalOnError(err, { ...customSubmitsData, submitIndex })}
			catchError={err => payPalOnError(err, { ...customSubmitsData, submitIndex })}
			options={{
				// eslint-disable-next-line no-undef
				clientId: PAYPAL_CLIENT_ID,
				intent: 'authorize',
				'disable-funding': 'card,credit,sepa',
			}}
			style={{
				color: 'white',
				layout: 'horizontal',
				shape: 'pill',
				label: 'paypal',
				tagline: false,
			}}
		/>
	</div>
))

export default withModuleContext(
	buttonConnector(PayPalButtonUnconnected, styles),
)
