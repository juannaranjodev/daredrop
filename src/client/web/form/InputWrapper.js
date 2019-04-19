import React, { memo } from 'react'

import { orNull } from 'root/src/shared/util/ramdaPlus'
import classNames from 'classnames'

import TertiaryBody from 'root/src/client/web/typography/TertiaryBody'
import TitleFormText from 'root/src/client/web/typography/TitleFormText'
import SubFieldTopCaption from 'root/src/client/web/typography/SubFieldTopCaption'

import { withStyles } from '@material-ui/core/styles'

const styles = {
	space: {
		marginBottom: 25,
	},
	subFieldText: {
		marginTop: 8,
	},
	subFieldTopText: {
		margin: '8px 0',
	},
	inline: {
		display: 'inline',
	},
	labelFieldText: {
		marginBottom: 8,
	},
}

const Fields = memo(
	({
		subFieldText,
		subFieldTopText,
		labelFieldText,
		classes,
		children,
		formType,
	}) => (
		<div className={classNames(classes.space, { [classes.inline]: (formType === 'universalForm') })}>
			{orNull(
				labelFieldText,
				<div className={classes.labelFieldText}>
					<TitleFormText>{labelFieldText}</TitleFormText>
				</div>,
			)}
			{orNull(
				subFieldTopText,
				<div className={classes.subFieldTopText}>
					<SubFieldTopCaption>{subFieldTopText}</SubFieldTopCaption>
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
