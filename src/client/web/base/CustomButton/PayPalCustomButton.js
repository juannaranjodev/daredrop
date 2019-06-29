import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { primaryColor, blackColorBorder } from 'root/src/client/web/commonStyles'
import ButtonBase from '@material-ui/core/ButtonBase'
import PayPalIcon from 'root/src/client/assets/paypalIcon.svg'
import PayPalImage from 'root/src/client/assets/paypal.svg'

const style = {
	button: {
		width: '100%',
		height: '45px',
		outline: 'none',
		borderRadius: 200,
		background: 'none',
		border: blackColorBorder,
		fontSize: 18,
		cursor: 'pointer',
		fontWeight: 400,
		padding: [[5, 0, 5, 0]],
		backgroundColor: '#fff',
		color: primaryColor,
	},
	img: {
		height: '21px',
	},
}

const Button = ({ classes, onClick, title, customSubmitsData }) => (
	<ButtonBase
		className={classes.button}
		onClick={() => onClick(customSubmitsData)}
	>
		<div>
			<img className={classes.img} src={PayPalIcon} alt={title} />
			<img className={classes.img} src={PayPalImage} alt={title} />
		</div>
	</ButtonBase>
)

Button.propTypes = {
	title: PropTypes.string,
	onClick: PropTypes.func,
}

Button.defaultProps = {
	title: 'Click me to Payout',
	onClick: () => {},
}

export default withStyles(style)(Button)
