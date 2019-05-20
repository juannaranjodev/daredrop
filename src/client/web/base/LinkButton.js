import React, { memo } from 'react'

import Button from '@material-ui/core/Button'

import {
	primaryButton,
	noBackgroundButton,
	outlinedButton,
} from 'root/src/client/web/componentTypes'


import classNames from 'classnames'
import linkConnector from 'root/src/client/logic/app/connectors/linkConnector'

import linkHandler from 'root/src/client/logic/app/handlers/linkHandler'
import styles from './buttonStyle'

export const BaseLink = memo(({
	pushRoute, routeId, routeParams,
	children, classes, additionalClass,
	isStyled, buttonType, disabled, disableRipple,
}) => (
	<Button
		className={classNames(
			classes.button,
			{ [classes.styledButton]: isStyled },
			({ [classes.primaryButton]: buttonType === primaryButton }),
			({ [classes.noBackgroundButton]: buttonType === noBackgroundButton }),
			({ [classes.outlinedButton]: buttonType === outlinedButton }),
			additionalClass,
		)}
		onClick={linkHandler(routeId, routeParams, pushRoute)}
		disabled={disabled}
		disableRipple={disableRipple}
	>
		{children}
	</Button>
))

export default linkConnector(BaseLink, styles)
