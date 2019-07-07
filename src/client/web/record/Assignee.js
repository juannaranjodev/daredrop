import React, { memo } from 'react'
import { equals } from 'ramda'
import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import SubHeader from 'root/src/client/web/typography/SubHeader'
import { primaryColor } from 'root/src/client/web/commonStyles'
import { streamerAcceptedKey } from 'root/src/server/api/lenses'

const styles = {
	image: {
		width: 100,
		height: 100,
	},
	linkStyle: {
		textDecoration: 'none',
	},
	linkText: {
		color: 'black',
		marginLeft: 8,
		marginTop: -12,
		'& div': {
			fontWeight: 'bold',
		},
	},
	imageContainer: {
		position: 'relative'
	},
	marksContainer: {
		position: 'absolute',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		height: 14,
	},
	acceptedMark: {
		border: `1px solid ${primaryColor}`,
		color: 'white',
		backgroundColor: primaryColor,
		width: '100%',
		borderRadius: 5,
		textAlign: 'center',
		fontSize: 11,
		fontWeight: 500,
		fontStyle: 'italic',
		zIndex: 201,
	}
}

const Assignee = memo(({ displayName, image, username, classes, accepted }) => (
	<a
		href={`http://www.twitch.tv/${username}`}
		rel="noopener noreferrer"
		target="_blank"
		className={classNames('flex-190', classes.linkStyle)}
	>
		<div className="flex layout-row layout-align-space-between-center">
			<div className={classNames('flex-65', classes.imageContainer)}>
				{equals(accepted, streamerAcceptedKey) && 
					<div className={classes.marksContainer}>
						<div className={classes.acceptedMark}>
							Dare Accepted
						</div>
					</div>
				}
				<img
					src={image}
					alt={username}
					className={classes.image}
				/>
			</div>
			<div className={classNames('flex-55', classes.linkText)}>
				<SubHeader>{displayName}</SubHeader>
			</div>
		</div>
	</a>
))

export default withStyles(styles)(Assignee)
