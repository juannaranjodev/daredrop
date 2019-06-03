import React, { memo } from 'react'
import { map } from 'ramda'
import PayPalButton from 'root/src/client/web/base/CustomButton/PayPalButton'

export const SubmitsUnstyled = memo(({
	customSubmits, customSubmitsData, payPalCreateOrder, payPalOnApprove,
}) => (
	<div>{map(([submit, submitIndex]) => {
		switch (submit) {
			case 'payPalButton':
				return (
					<PayPalButton
						key={`${submitIndex}-custom`}
						payPalOnApprove={payPalOnApprove}
						payPalCreateOrder={payPalCreateOrder}
						customSubmitsData={customSubmitsData}
						submitIndex={submitIndex}
					/>
				)
			default:
		}
	}, customSubmits)}
	</div>
))

export default SubmitsUnstyled
