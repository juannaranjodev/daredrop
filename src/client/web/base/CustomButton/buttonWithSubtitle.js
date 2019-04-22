import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { primaryColor, primaryColorBorder } from 'root/src/client/web/commonStyles'

const style = {
	button: {
		width: '100%',
		outline: 'none',
		borderRadius: 30,
		background: 'none',
		border: primaryColorBorder,
		fontSize: 18,
		cursor: 'pointer',
		boxShadow: '0 5px 6px 0 rgba(0, 0, 0, 0.16)',
		fontWeight: 400,
		padding: [[5, 0, 5, 0]],
		backgroundColor: '#fff',
		color: primaryColor,
	},
	subTitle: {
		fontSize: 12,
		fontWeight: 200,
	},
}

const Button = ({ classes, title, subtitle, onClick }) => (
	<button type="button" onClick={onClick} className={classes.button}>
		<div className={classes.title}>{title}</div>
		<div className={classes.subTitle}>{subtitle}</div>
	</button>
)

Button.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.string,
	onClick: PropTypes.func,
}

Button.defaultProps = {
	title: 'Button',
	subtitle: 'subtitle',
	onClick: () => {},
}

export default withStyles(style)(Button)
