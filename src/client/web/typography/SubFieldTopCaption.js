import React, { memo } from 'react'

import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
import {
	lightGrey, fontFamily,
} from 'root/src/client/web/commonStyles'

const styles = {
	fontStyle: {
		fontFamily,
		fontSize: 12,
		color: lightGrey,
	},
}

export const SubFieldTopCaption = memo((({ classes, children }) => (
	<div className={classNames(classes.fontStyle)}>
		{children}
	</div>
)))

export default withStyles(styles)(SubFieldTopCaption)
