import React, { memo } from 'react'

import { orNull } from 'root/src/shared/util/ramdaPlus'
import classNames from 'classnames'

import TertiaryBody from 'root/src/client/web/typography/TertiaryBody'
import TitleFormText from 'root/src/client/web/typography/TitleFormText'
import Body from 'root/src/client/web/typography/Body'
import { doveGray } from 'root/src/client/web/commonStyles'
import SubTitle from 'root/src/client/web/typography/SubTitle'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	space: {
		marginBottom: 25,
	},
	subFieldText: {
		marginTop: 8,
	},
	inline: {
		display: 'inline',
	},
	labelFieldText: {
		marginBottom: 8,
	},
	subTextLabel: {
		marginBottom: 20,
		marginTop: -8,
		'& div': {
			fontSize: 18,
			color: '#707070',
		},
	},
}

const Fields = memo(
	({
		subFieldText,
		labelFieldText,
		classes,
		children,
		formType,
		subTextLabel,
	}) => (
		<div className={classNames(classes.space, { [classes.inline]: (formType === 'universalForm') })}>
			{orNull(
				labelFieldText,
				<div className={classes.labelFieldText}>
					<TitleFormText>{labelFieldText}</TitleFormText>
				</div>,
			)}
			{orNull(
				subTextLabel,
				<div className={classes.subTextLabel}>
					<SubTitle>{subTextLabel}</SubTitle>
				</div>,
			)}
			{children}
			{orNull(
				subFieldText,
				<div className={classes.subFieldText}>
					<TertiaryBody>{subFieldText}</TertiaryBody>
				</div>,
			)}
		</div>
	),
)

export default withStyles(styles)(Fields)
