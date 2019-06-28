import React, { memo } from 'react'
import { map, pathOr, gte } from 'ramda'
import PayPalButton from 'root/src/client/web/base/CustomButton/PayPalButton'
import PayPalCustomButton from 'root/src/client/web/base/CustomButton/PayPalCustomButton'


export const SubmitsUnstyled = memo(({
	customSubmits, customSubmitsData, payPalCreateOrder, payPalOnApprove, payPalOnError, customPayPalAction,
}) => (
	<div>{map(([submit, submitIndex]) => {
		const pledgeAmount = pathOr(0, ['formData', 'pledgeAmount'], customSubmitsData)
		switch (submit) {
			case 'payPalButton':
				return (
					gte(pledgeAmount, 5) ? (
						<PayPalButton
							key={`${submitIndex}-custom`}
							payPalOnApprove={payPalOnApprove}
							payPalCreateOrder={payPalCreateOrder}
							payPalOnError={payPalOnError}
							customSubmitsData={customSubmitsData}
							submitIndex={submitIndex}
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
