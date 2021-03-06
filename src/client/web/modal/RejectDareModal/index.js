import React, { useState, Fragment, memo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { DARE_REJECT_SUCCESS_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'
import { equals } from 'ramda'

import Button from 'root/src/client/web/base/Button'
import styles from './styles'

const RejectDareModal = memo(({ classes, props }) => {
	const [rejectDescription, setRejectDescription] = useState('')
	const [error, setError] = useState('')
	const { rejectProject, pushRoute, displayModal, moduleId } = props
	return (
		<Fragment>
			<div className={classes.reason}>
				Reason:
			</div>
			<textarea
				className={classes.description}
				placeholder="Email to pledgers, for
				example: It's too hard, you're more talented than me."
				value={rejectDescription}
				onChange={e => setRejectDescription(e.target.value)}
			/>
			<div className={classes.error}>{error}</div>
			<Button
				additionalClass={classes.button}
				onClick={() => rejectProject(rejectDescription).then(({ statusCode, schemaErrors }) => {
					if (equals(statusCode, 200)) {
						displayModal(moduleId, false)
						pushRoute(DARE_REJECT_SUCCESS_ROUTE_ID)
					} else {
						setError(schemaErrors.message)
					}
				})}
			>Confirm
			</Button>
		</Fragment>
	)
})


export default withStyles(styles)(RejectDareModal)
