import React, { memo } from 'react'

import withStyles from '@material-ui/core/styles/withStyles'

import Settings from 'root/src/client/web/base/StaticLayout'

import Button from './Button'
import styles from './style'
import content from './pageContent'

const { lead, buttons } = content

const AccountSettings = memo(({ classes }) => (
	<Settings>
		<section className={classes.section}>
			<h3 className={classes.sectionTitle}>{lead}</h3>
			<div className={classes.buttons}>
				{buttons.map(({ text, routeId, href }) => (
					<Button className={classes.button} key={routeId || href} routeId={routeId} href={href}>{text}</Button>
				))}
			</div>
		</section>
	</Settings>
))
export default withStyles(styles)(AccountSettings)
