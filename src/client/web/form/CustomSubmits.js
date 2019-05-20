import React, { memo } from 'react'
import { addIndex, map } from 'ramda'

export const SubmitsUnstyled = memo(({
	customSubmits, ...all
}) => (
	<div>{console.log(all)}
		{addIndex(map)((Submit, idx) => (
			<Submit key={idx} />
		), customSubmits)}
	</div>
))

export default SubmitsUnstyled
