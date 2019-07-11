import React, { memo } from 'react'
import { map, pathOr, gte } from 'ramda'
import PayPalButton from 'root/src/client/web/base/CustomButton/PayPalButton'
import PayPalCustomButton from 'root/src/client/web/base/CustomButton/PayPalCustomButton'
import { PAYPAL_BUTTON } from 'root/src/client/logic/form/buttonNames'

export const SubmitsUnstyled = memo(({
	customSubmits, customSubmitsData, payPalCreateOrder, payPalOnApprove, payPalOnError, customPayPalAction,
}) => (
	<div>{map(([submit, submitIndex]) => {
		const pledgeAmount = pathOr(0, ['formData', 'pledgeAmount'], customSubmitsData)
		switch (submit) {
			case 'payPalButton':
				return (
					gte(pledgeAmount, 1) ? (
						<PayPalButton
							key={`${submitIndex}-custom`}
							payPalOnApprove={payPalOnApprove}
							payPalCreateOrder={payPalCreateOrder}
							payPalOnError={payPalOnError}
							customSubmitsData={customSubmitsData}
							submitIndex={submitIndex}
							buttonName={PAYPAL_BUTTON}
						/>
					) : (
						<PayPalCustomButton
							key={`${submitIndex}-custom`}
							customSubmitsData={customSubmitsData}
							onClick={customPayPalAction}
						/>
					)
				)
			default:
		}
	}, customSubmits)}
	</div>
))

export default SubmitsUnstyled
