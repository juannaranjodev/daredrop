import React, { memo, useState } from 'react'
import { isNil, filter, not, equals } from 'ramda'
import withModuleContext from 'root/src/client/util/withModuleContext'
import projectListItemConnector from 'root/src/client/logic/project/connectors/projectListItemConnector'
import goToSignInHandler from 'root/src/client/logic/project/handlers/goToSignInHandler'
import goToPledgeProjectHandler from 'root/src/client/logic/project/handlers/goToPledgeProjectHandler'
import Button from 'root/src/client/web/base/Button'
import ShareMenu from 'root/src/client/web/base/ShareMenu'
import Body from 'root/src/client/web/typography/Body'
import TertiaryBody from 'root/src/client/web/typography/TertiaryBody'
import clipTitleHandler from 'root/src/client/logic/project/handlers/clipTitleHandler'
import classNames from 'classnames'
import { ternary, orNull } from 'root/src/shared/util/ramdaPlus'

import { ACTIVE_PROJECTS_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from 'fortawesome-light/fontawesome-light'
import { projectCardStyle } from 'root/src/client/web/list/style'

export const ListItemUnconnected = memo(({
	recordId, pushRoute, projectTitle, projectDescription, classes,
	projectGameImage, projectAssigneesImages, projectShareUrl, projectGames, isAuthenticated,
	projectAssigneesName, projectPledged, projectAccepted,
	projectDeliveries, listRouteHandler, goalProgress, setTimeoutId,
}) => {
	const [hover, setHover] = useState(false)
	const [over, setOver] = useState(false)
	const [nameHover, setNameHover] = useState(undefined)
	const [nameOver, setNameOver] = useState(undefined)

	const onMouseLeave = func => () => {
		const timeout = setTimeout(() => func(undefined), 1000)
		setTimeoutId(timeout)
	}

	return (
		<section
			className={classNames(classes.cardRoot, (over || hover) && classes.hover)}
			onMouseEnter={() => setOver(true)}
			onMouseLeave={() => setOver(false)}
			onMouseOver={() => setOver(true)}
		>
			{orNull(projectDeliveries, <div
				className={classes.videoOverlay}
				onClick={listRouteHandler(recordId, pushRoute)}
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
							'header-container',
							({ [classes.noOverlay]: projectDeliveries }),
						)}
					>
						{
							(projectPledged || projectAccepted) && (
								<div className={classes.marksContainer}>
									{projectAccepted && (
										<div className={classes.acceptedMark}>
											Dare Accepted
										</div>
									)
									}
									{projectPledged && (
										<div className={classes.pledgedMark}>
											Pledged
										</div>
									)
									}
								</div>
							)
						}
						<div className={classes.headerContainer}>
							<div
								className={classNames(classes.headerText, 'flex')}
								onClick={listRouteHandler(recordId, pushRoute)}
							>
								<h3 className={classNames(classes.headerTextH3, 'header-element')}>{clipTitleHandler(projectTitle)}</h3>
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
				</div>
				<div
					onClick={listRouteHandler(recordId, pushRoute)}
					className={classes.bodyCard}
				>
					<div className={classNames(
						'layout-row layout-align-center',
						classes.projectAssigne,
						projectAssigneesImages.length > 5 && classes.projectUnsetJustify,
					)}
					>
						{orNull(projectDeliveries,
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
					<div className={classNames(classes.progressOuter)}>
						<div className={classNames(classes.progressInner)} style={{ width: `${goalProgress}%` }} />
					</div>
					<div
						className={classNames(
							'layout-column layout-align-space-around',
							classes.cardFooter,
							({ [classes.noOverlay]: projectDeliveries }),
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
						goToPledgeProjectHandler({
							recordId,
							backPage: { routeId: ACTIVE_PROJECTS_ROUTE_ID },
						}, pushRoute),
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
	projectListItemConnector(ListItemUnconnected, projectCardStyle),
)
