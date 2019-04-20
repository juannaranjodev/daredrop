import React, { memo, useState } from 'react'
import { isNil } from 'ramda'
import withModuleContext from 'root/src/client/util/withModuleContext'
import projectListItemConnector from 'root/src/client/logic/project/connectors/projectListItemConnector'
import goToViewProjectHandler from 'root/src/client/logic/project/handlers/goToViewProjectHandler'
import goToSignInHandler from 'root/src/client/logic/project/handlers/goToSignInHandler'
import goToPledgeProjectHandler from 'root/src/client/logic/project/handlers/goToPledgeProjectHandler'
import Button from 'root/src/client/web/base/Button'
import ShareMenu from 'root/src/client/web/base/ShareMenu'
import Body from 'root/src/client/web/typography/Body'
import TertiaryBody from 'root/src/client/web/typography/TertiaryBody'
import classNames from 'classnames'
import { ternary, orNull } from 'root/src/shared/util/ramdaPlus'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-regular-svg-icons'

const styles = {
	cardRoot: {
		margin: [[0, 10, 20]],
		color: 'white',
		width: '280px',
		alignSelf: 'center',
		height: '306px',
		borderRadius: '4px',
		overflow: 'hidden',
		boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
		cursor: 'pointer',
		transition: '0.1s',
		position: 'relative',

	},
	hover: {
		boxShadow: '0 1px 26px 0 rgba(0,0,0,1)',
		transform: 'scale(1.05)',
	},
	cardBg: {
		backgroundPosition: 'bottom',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		height: '100%',
		width: '280px',
		transition: '0.7s',
	},
	cardHeader: {
		height: 60,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		padding: [[0, 16]],
		transition: '0.7s',
	},
	headerText: {
		fontSize: '20px',
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		transition: '0s',
		zIndex: 201,
	},
	headerTextH3: {
		fontSize: '20px',
		fontFamily: 'Roboto',
		fontWeight: '500',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: '1.2',
		letterSpacing: '0.3px',
		transition: '0s',
		zIndex: 201,
	},
	cardFooter: {
		height: 147,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		padding: [[11, 16, 8]],
		transition: '0.7s',
	},
	cardGameTitle: {
		marginBottom: 10,
		transition: '0s',
		zIndex: 201,
	},
	description: {
		height: 40,
		display: '-webkit-box',
		WebkitLineClamp: 2,
		WebkitBoxOrient: 'vertical',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginBottom: 60,
		transition: '0s',
		zIndex: 201,
	},
	playIcon: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 202,
	},
	assigneeImg: {
		width: 100,
		height: 100,
		transition: '0s',
		'&:not(:only-of-type)': {
			marginRight: -2,
		},
		'&:nth-last-child(n+3), &:nth-last-child(n+3) ~ img': {
			width: 90,
			height: 90,
		},
		'&:nth-last-child(n+4), &:nth-last-child(n+4) ~ img': {
			width: 70,
			height: 70,
		},
		'&:nth-last-child(n+5), &:nth-last-child(n+5) ~ img': {
			width: 50,
			height: 50,
		},
		'&:nth-child(n+6), &:nth-child(n+6) ~ img': {
			marginTop: -5,
		},
		'&:nth-last-child(n+11), &:nth-last-child(n+11) ~ img': {
			width: 25,
			height: 25,
		},
		'&:nth-last-child(n+41), &:nth-last-child(n+41) ~ img': {
			width: 15,
			height: 15,
		},
		'&:nth-last-child(n+101), &:nth-last-child(n+101) ~ img': {
			width: 7,
			height: 7,
		},
	},
	descriptionText: {
		fontWeight: 'normal',
		fontStyle: 'normal',
		fontStretch: 'normal',
		lineHeight: '1.25',
		letterSpacing: '0.3px',
		fontFamily: 'Roboto',
		transition: '0.7s',
	},
	buttonContainer: {
		textAlign: 'center',
		marginTop: -42,
		margin: '0 auto',
		width: '93px',
	},
	projectAssigne: {
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center',
		padding: '7 auto',
		height: 100,
		marginBottom: 7,
		position: 'relative',
		marginTop: 7,
	},
	button: {
		width: '93px',
		height: '36px',
		borderRadius: '20px',
		zIndex: 201,
		'& span': {
			fontWeight: 'bold',
			textTransform: 'none',
			fontSize: 18,
			lineHeight: 1.20,
			letterSpacing: 1.6,
		},
	},
	shareIcon: {
		margin: [[12, -12, 0]],
	},
	inLineBlock: {
		display: 'inline',
	},
	projectUnsetJustify: {
		justifyContent: 'start !important',
		marginLeft: 18,
	},
	hoveredName: {
		fontSize: 14,
		background: '#800080',
		fontWeight: 'bold',
		borderRadius: 5,
		padding: 10,
		width: 'auto',
	},
	hoveredNameContainer: {
		width: '100%',
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		top: 0,
	},
	bodyCard: {
		position: 'relative',
	},
	videoOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		zIndex: 200,
		backgroundColor: 'rgba(0, 0, 0, 0.74)',
		overflow: 'hidden',
	},
	noOverlay: {
		backgroundColor: 'rgba(0, 0, 0, 0)',
		hoveredName: {
			fontSize: 14,
			background: '#800080',
			fontWeight: 'bold',
			borderRadius: 5,
			padding: 10,
			width: 'auto',
		},
		hoveredNameContainer: {
			width: '100%',
			position: 'absolute',
			display: 'flex',
			justifyContent: 'center',
			top: 0,
		},
		bodyCard: {
			position: 'relative',
		},
	},
}

export const ListItemUnconnected = memo(({
	recordId, pushRoute, projectTitle, projectDescription, classes,
	projectGameImage, projectAssigneesImages, projectShareUrl, projectGames, isAuthenticated,
	projectAssigneesName, approvedVideoUrl,
}) => {
	const [hover, setHover] = useState(false)
	const [over, setOver] = useState(false)
	const [nameHover, setNameHover] = useState(undefined)
	const [nameOver, setNameOver] = useState(undefined)

	const onMouseLeave = func => () => {
		setTimeout(() => { func(undefined) }, 1000)
	}


	return (
		<section
			className={classNames(classes.cardRoot, (over || hover) && classes.hover)}
			onMouseEnter={() => setOver(true)}
			onMouseLeave={() => setOver(false)}
			onMouseOver={() => setOver(true)}
		>
			{orNull(approvedVideoUrl, <div
				className={classes.videoOverlay}
				onClick={goToViewProjectHandler(recordId, pushRoute)}
			/>)}
			<div
				className={classNames(
					'flex layout-column',
					classes.cardBg,
				)}
				style={{ backgroundImage: `url(${projectGameImage})` }}
			>
				<div>
					<div
						className={classNames(
							classes.cardHeader,
							'layout-row layout-align-start-center',
							({ [classes.noOverlay]: approvedVideoUrl }),
						)}
					>
						<div
							className={classNames(classes.headerText, 'flex')}
							onClick={goToViewProjectHandler(recordId, pushRoute)}
						>
							<h3 className={classNames(classes.headerTextH3)}>{projectTitle}</h3>
						</div>
						<div className={classes.shareIcon}>
							<ShareMenu
								url={projectShareUrl}
								onOpen={() => { setOver(false); setHover(true) }}
								onClose={() => { setOver(false); setTimeout(() => { setHover(false) }, 400) }}
							/>
						</div>
					</div>
				</div>
				<div
					onClick={goToViewProjectHandler(recordId, pushRoute)}
					className={classes.bodyCard}
				>
					<div className={classNames(
						'layout-row layout-align-center',
						classes.projectAssigne,
						projectAssigneesImages.length > 5 && classes.projectUnsetJustify,
					)}
					>
						{orNull(approvedVideoUrl,
							<FontAwesomeIcon
								className={classes.playIcon}
								icon={faPlayCircle}
								size="5x"
								color="#ffffff"
							/>)}
						{projectAssigneesImages.map((imgSrc, i) => (
							<img
								key={i}
								className={classes.assigneeImg}
								src={imgSrc}
								onMouseEnter={() => setNameHover(i)}
								onMouseLeave={onMouseLeave(setNameHover)}
								alt={`Assignee${i}`}
							/>
						))}
					</div>
					{
						orNull(
							(!isNil(nameHover) || !isNil(nameOver)),
							<div
								className={classes.hoveredNameContainer}
								onMouseEnter={() => setNameOver(nameHover)}
								onMouseLeave={onMouseLeave(setNameOver)}
							>
								<div className={classes.hoveredName}>
									{projectAssigneesName[nameOver] || projectAssigneesName[nameHover]}
								</div>
							</div>,
						)
					}
					<div
						className={classNames(
							'layout-column layout-align-space-around',
							classes.cardFooter,
							({ [classes.noOverlay]: approvedVideoUrl }),
						)}
					>
						<div className={classes.cardGameTitle}>
							<TertiaryBody>{projectGames.map(({ name }) => name)}</TertiaryBody>
						</div>
						<div className={classes.description}>
							<Body style={classes.descriptionText}>{projectDescription}</Body>
						</div>
					</div>
				</div>
			</div>
			<div className={classes.buttonContainer}>
				<Button
					onClick={ternary(
						isAuthenticated,
						goToPledgeProjectHandler(recordId, pushRoute),
						goToSignInHandler(pushRoute),
					)}
					style={classes.button}
				>
					Pledge
				</Button>
			</div>
		</section>
	)
})

export default withModuleContext(
	projectListItemConnector(ListItemUnconnected, styles),
)
