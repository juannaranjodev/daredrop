import React, { memo } from 'react'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import SubHeader from 'root/src/client/web/typography/SubHeader'

const styles = {
	image: {
		width: 100,
		height: 100,
	},
	linkStyle: {
		textDecoration: 'none',
		flexBasis: 1,
		flexGrow: 1,
	},
	linkText: {
		color: 'black',
		marginLeft: 8,
		marginTop: -12,
		'& div': {
			fontWeight: 'bold',
		},
	},
	fontStyle: {
		whiteSpace: 'nowrap',
	    overflow: 'hidden',
	    textOverflow: 'ellipsis'
	}
}

const Assignee = memo(({ displayName, image, username, classes }) => (
	<a
		href={`http://www.twitch.tv/${username}`}
		rel="noopener noreferrer"
		target="_blank"
		className={classNames('flex-190', classes.linkStyle)}
	>
		<div className="flex layout-row layout-align-space-between-center">
			<div className="">
				<img
					src={image}
					alt={username}
					className={classes.image}
				/>
			</div>
			<div className={classNames('flex-55', classes.linkText, classes.fontStyle)}>
				<SubHeader additionalClass={classes.fontStyle}>{displayName}</SubHeader>
			</div>
		</div>
	</a>
))

export default withStyles(styles)(Assignee)
