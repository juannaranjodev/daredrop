/* eslint-disable max-len */
import { PayPalButton } from 'react-paypal-button-v2'
import React, { memo } from 'react'
import withModuleContext from 'root/src/client/util/withModuleContext'
import buttonConnector from 'root/src/client/logic/form/connectors/buttonConnector'
import { orNull } from 'root/src/shared/util/ramdaPlus'

const styles = {
	errorTip: {
		width: '100%',
		color: '#f00',
		height: '27px',
		outline: 'none',
		padding: '5px 0 5px 0',
		fontSize: '15px',
		background: 'none',
		fontWeight: '400',
		textAlign: 'center',
		backgrounColor: '#fff',
	},
}


const PayPalButtonUnconnected = memo(({
	payPalCreateOrder, payPalOnApprove, payPalOnError,
	customSubmitsData, submitIndex, buttonErrorTip, classes,
}) => (
	<div>
		{orNull(
			buttonErrorTip,
			<div className={classes.errorTip}>
				{buttonErrorTip}
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
