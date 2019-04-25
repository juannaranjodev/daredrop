import React, { memo } from 'react'

import { withStyles } from '@material-ui/core/styles'
import Button from 'root/src/client/web/base/Button'
import formActionHandler from 'root/src/client/logic/form/handlers/formActionHandler'

const styles = {
	container: {
		marginTop: 10,
	},
}

export const Handlers = memo(({
	formHandlers, moduleKey, handlerFn, formType, classes,
}) => (
	<div className={classes.container}>
		{formHandlers.map(([label, submitIndex, buttonType]) => (
			<Button
				key={submitIndex}
				onClick={formActionHandler(handlerFn, moduleKey, submitIndex)}
				formType={formType}
				buttonType={buttonType}
			>
				{label}
			</Button>
		))}
	</div>
))

export default withStyles(styles)(Handlers)
