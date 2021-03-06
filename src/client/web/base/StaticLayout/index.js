import React, { memo } from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import styles from './style'

const MainContainer = memo(({ children, classes }) => (
	<main className={classes.mainContent}>
		<div className={classes.container}>
			<div className={classes.wrapper}>{children}</div>
		</div>
	</main>
))

MainContainer.propTypes = {
	children: PropTypes.node.isRequired,
}

export default withStyles(styles)(MainContainer)
