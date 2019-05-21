import React, { memo } from 'react'
import cardDateSelector from 'root/src/client/web/list/util/cardDateSelector'
import paymentMethodListItemConnector from 'root/src/client/logic/paymentMethod/connectors/paymentMethodListItemConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { equals } from 'ramda'

import classNames from 'classnames'

import Button from 'root/src/client/web/base/Button'
import RadioButton from 'root/src/client/web/base/RadioButton'

const styles = {
	root: {
		width: '100%',
		marginBottom: 27,
		cursor: 'pointer',
	},
	paymentDetails: {
		transform: 'translateY(1px)',
	},
	button: {
		width: 'auto',
		margin: '0 10px 0 0',
	},
}

export const PaymentMethodUnconnected = memo(({
	classes, expMonth, expYear, lastFour, openModal, isDefault, onClick, recordId, brand,
}) => (
	<div
		className={classNames('flex layout-row layout-align-space-between-center', classes.root)}
	>
		<div
			onClick={() => onClick(recordId)}
			className={classNames('flex layout-row layout-align-space-between-center')}
		>
			<RadioButton checked={isDefault} />

			{ternary(equals(brand, 'PayPal'),
				<div className={classNames('flex layout-column', classes.paymentDetails)}>
					<strong>{brand}</strong>
				</div>,
				<div className={classNames('flex layout-column')}>
					<strong>{brand} ****{lastFour}</strong>
					<span>Expires {cardDateSelector(expMonth, expYear)}</span>
				</div>)}
		</div>

		<Button
			type="button"
			onClick={() => openModal()}
			buttonType="noBackgroundButton"
			additionalClass={classes.button}
			isStyled
			disableRipple
		>
				Remove
		</Button>
	</div>
))

export default withModuleContext(
	paymentMethodListItemConnector(PaymentMethodUnconnected, styles),
)
