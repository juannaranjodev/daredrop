import React, { memo } from 'react'
import { isNil } from 'ramda'
import { primaryColor } from 'root/src/client/web/commonStyles'
import SuccessMessageConnector from 'root/src/client/logic/app/connectors/SuccessMessageConnector'

const styles = {
	successMessage: {
		position: 'absolute',
		color: '#ffffff',
		fontWeight: 'bold',
		backgroundColor: primaryColor,
		padding: '0px 12px',
		zIndex: 2000,
		borderRadius: 5,
	},
}

const SuccessMessage = memo(({ isShow, position, text, classes }) => (
	<div>
		{ isShow && (
			<div
				className={classes.successMessage}
				style={{
					left: !isNil(position) && position.x,
					top: !isNil(position) && position.y - 20,
				}}
			>{text}
			</div>
		) }
	</div>
))

export default SuccessMessageConnector(SuccessMessage, styles)
