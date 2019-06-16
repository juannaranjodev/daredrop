import React, { memo } from 'react'

import Button from '@material-ui/core/Button'

import {
	primaryButton,
	universalForm,
	noBackgroundButton,
	outlinedButton,
} from 'root/src/client/web/componentTypes'

import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'

import styles from './buttonStyle'

export const ButtonUnstyled = memo(({
	classes, onClick, disabled, children, style, isSmallButton,
	buttonType, unstyled, additionalClass, formType,
}) => (
		<Button
			className={classNames(
				style,
				classes.button,
				{ [classes.unstyled]: unstyled },
				({ [classes.primaryButton]: buttonType === primaryButton || formType === universalForm }),
				({ [classes.noBackgroundButton]: buttonType === noBackgroundButton }),
				({ [classes.outlinedButton]: buttonType === outlinedButton }),
				({ [classes.smallButton]: isSmallButton }),
				({ [classes.outlinedButton]: buttonType === outlinedButton }),
				additionalClass,
			)}
			onClick={onClick}
			disabled={disabled}
			disableRipple
		>
			{children}
		</Button>
	))

export default withStyles(styles)(ButtonUnstyled)
