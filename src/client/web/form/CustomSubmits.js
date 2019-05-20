import React, { memo } from 'react'

export const SubmitsUnstyled = memo(({
	customSubmits, moduleKey, submitFormFn, formType, setWasSubmitted, classes,
}) => (
	<div>
		{customSubmits.map(Submit => (
			<Submit />
		))}
	</div>
))

export default SubmitsUnstyled
