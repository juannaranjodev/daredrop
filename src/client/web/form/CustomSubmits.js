import React, { memo } from 'react'
import { map } from 'ramda'

export const SubmitsUnstyled = memo(({
	customSubmits, customSubmitsData, payPalCreateOrder,
}) => (
	<div>{map(([Submit, specificSubmitProps, submitIndex]) => (
		<Submit key={submitIndex} props={{ ...specificSubmitProps, payPalCreateOrder }} customSubmitsData={customSubmitsData} />
	), customSubmits)}
	</div>
))

export default SubmitsUnstyled
