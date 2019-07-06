import React, { Fragment, memo } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { orNull } from 'root/src/shared/util/ramdaPlus'
import { primaryColor } from 'root/src/client/web/commonStyles'

const styles = {
	root: {
		border: '1px solid rgba(128, 0, 128, 0.4)',
		borderRadius: 2000,
		height: 12,
		width: '100%',
		marginTop: 7,
		marginBottom: 5,
	},
	inside: {
		backgroundColor: primaryColor,
		borderRadius: 2000,
		height: '100%',
	},
	text: {
		fontFamily: 'Roboto',
		fontSize: 14,
		fontWeight: 500,
	},
}


const ProgressBar = memo(({ classes, uploadProgress }) => (orNull(uploadProgress, (
	<Fragment>
		<div className={classes.root}>
			<div className={classes.inside} style={{ width: `${(uploadProgress.currentProgress / uploadProgress.targetProgress) * 100}%` }} />
		</div>
		<span className={classes.text}>Video Uploading Please Wait....</span>
	</Fragment>
))))

export default withStyles(styles)(ProgressBar)
