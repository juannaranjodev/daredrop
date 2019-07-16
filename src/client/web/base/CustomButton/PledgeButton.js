import React, { memo } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import { styledPledgeButton } from './style'

const Button = memo(({ title, backgroundColor, color, classes }) => (
	<button className={classes.button} type="button" style={{ backgroundColor, color }}>{title}</button>
))

Button.propTypes = {
	title: PropTypes.string.isRequired,
	backgroundColor: PropTypes.string,
	color: PropTypes.string,
}


Button.defaultProps = {
	backgroundColor: '#800080',
	color: '#fff',
}

export default withStyles(styledPledgeButton)(Button)
