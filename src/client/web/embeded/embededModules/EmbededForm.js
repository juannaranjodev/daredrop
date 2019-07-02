/* eslint-disable import/no-named-as-default */
import { withStyles } from '@material-ui/core/styles'
import React, { memo } from 'react'
import EmbededFields from 'root/src/client/web/embeded/embededModules/EmbededFields'

const styles = {
	embededFormModule: {
		padding: 1,
	},
}

const EmbededFormUnstyled = memo(({ classes, ...props }) => (
	<div className={classes.embededFormModule}>
		<EmbededFields {...props} />
	</div>
))

export default withStyles(styles)(EmbededFormUnstyled)
