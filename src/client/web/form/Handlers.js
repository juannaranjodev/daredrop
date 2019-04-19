import React, { memo } from 'react'

import Button from 'root/src/client/web/base/Button'
import formActionHandler from 'root/src/client/logic/form/handlers/formActionHandler'

export const Handlers = memo(({
	formHandlers, moduleKey, handlerFn, formType,
}) => (
	<div>
		{formHandlers.map(([label, submitIndex, submitting]) => (
			<Button
				key={submitIndex}
				loading={submitting}
				onClick={formActionHandler(handlerFn, moduleKey, submitIndex)}
				formType={formType}
			>
				{label}
			</Button>
		))}
	</div>
))

export default Handlers
