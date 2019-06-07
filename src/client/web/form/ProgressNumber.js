import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { orNull } from 'root/src/shared/util/ramdaPlus'

const styles = {
	text: {
		fontFamily: 'Roboto',
		fontSize: 15,
		fontWeight: 500,
	},
}


const ProgressBar = ({ classes, uploadProgress }) => (orNull(uploadProgress, (
	<span className={classes.text}>{`${Math.floor((uploadProgress.currentProgress / uploadProgress.targetProgress) * 100)}%`}</span>
)))

export default withStyles(styles)(ProgressBar)
