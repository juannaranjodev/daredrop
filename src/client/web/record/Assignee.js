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
		'@media screen and (max-width: 425px)': {
			width: 80,
			height: 80
		}
	},
	linkStyle: {
		textDecoration: 'none',
		flexBasis: 1,
		flexGrow: 1,
		width: '50%'
	},
	linkText: {
		color: 'black',
		width: 100,
		marginLeft: 8,
		'& div': {
			fontWeight: 'bold',
		},
		'@media screen and (max-width: 425px)': {
			width: 80,
		}
	},
	fontStyle: {
	    overflow: 'hidden',
	    textOverflow: 'ellipsis',
	    '@media screen and (max-width: 425px)': {
	    	fontSize: 17
	    }
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
	},
	wrapper: {
		maxWidth: 200
	},
	ellipse: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		display: '-webkit-box',
		'-webkit-box-orient': 'vertical',
		'-webkit-line-clamp': 3,
		lineHeight: '20px',
		maxHeight: 60,
		wordBreak: 'break-all'
	}
}

const Assignee = memo(({ displayName, image, username, classes, accepted }) => (
	<a
		href={`http://www.twitch.tv/${username}`}
		rel="noopener noreferrer"
		target="_blank"
		className={classNames('flex-190', classes.linkStyle)}
	>
		<div className={classNames("flex layout-row layout-align-start-center", classes.wrapper)}>
			<div className={classNames('', classes.imageContainer)}>
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
			<div className={classNames('', classes.linkText)}>
				<SubHeader additionalClass={classNames(classes.fontStyle, classes.ellipse)}>{displayName}</SubHeader>
			</div>
		</div>
	</a>
))

export default withStyles(styles)(Assignee)
