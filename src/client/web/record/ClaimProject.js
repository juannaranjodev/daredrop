import React, { memo } from 'react'
import SubHeader from 'root/src/client/web/typography/SubHeader'
import cn from 'classnames'

import viewProjectConnector from 'root/src/client/logic/project/connectors/viewProjectConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'

const styles = {
	container: {
		margin: '0 auto',
		width: 360,
		'@media (max-width: 600px)': {
			width: 340,
		},
	},
	text: {
		marginLeft: 5,
		fontSize: 20,
	},
}

const ClaimProjectDescription = memo(
	({ classes, projectDescription }) => (
		<div className={cn('flex', classes.container)}>
			<SubHeader>Description:</SubHeader>
			<p className={classes.text}>{projectDescription}</p>
		</div>
	),
)

export default withModuleContext(
	viewProjectConnector(ClaimProjectDescription, styles),
)
