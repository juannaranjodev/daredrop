import { map, addIndex, isNil, propOr, prop, replace } from 'ramda'
import React, { memo, useState, useEffect } from 'react'
import classNames from 'classnames'
import { orNull, ternary } from 'root/src/shared/util/ramdaPlus'

import {
	gtXsMediaQuery, gtSmMediaQuery, smMediaQuery,
} from 'root/src/client/web/commonStyles'

import Assignee from 'root/src/client/web/record/Assignee'

import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import Title from 'root/src/client/web/typography/Title'
import SubHeader from 'root/src/client/web/typography/SubHeader'
import Button from 'root/src/client/web/base/Button'
import LoadingButton from 'root/src/client/web/base/LoadingButton'

import ClaimButton from 'root/src/client/web/record/ClaimButton'
import TextField from '@material-ui/core/TextField'

import RecordClickActionButton from 'root/src/client/web/base/RecordClickActionButton'
import { APPROVE_PROJECT, REJECT_PROJECT, REJECT_ACTIVE_PROJECT } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'

import { VIEW_PROJECT_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

// import goToDeliveryDareFormHandler from 'root/src/client/logic/project/handlers/goToDeliveryDareFormHandler'
import viewProjectConnector from 'root/src/client/logic/project/connectors/viewProjectConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import goToSignInHandler from 'root/src/client/logic/project/handlers/goToSignInHandler'
import goToPledgeProjectHandler from 'root/src/client/logic/project/handlers/goToPledgeProjectHandler'

import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'

const styles = {
	centered: {
		margin: '0 auto',
	},
	title: {
		marginTop: 28,
		marginBottom: 20,
		'@media (min-width: 1284px)': {
			marginBottom: 25,
		},
	},
	image: {
		width: '100%',
	},
	iframeContainer: {
		position: 'relative',
		overflow: 'hidden',
		paddingTop: '100%',
	},
	iframe: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		border: 0,
	},
	sidebar: {
		[smMediaQuery]: {
			marginTop: 10,
		},
		[gtSmMediaQuery]: {
			paddingLeft: 40,
		},
	},
	sidebarItem: {
		marginTop: 10,
		marginBottom: 10,
		'& button': {
			borderRadius: 20,
			marginTop: 0,
			marginBottom: 0,
		},
		'& span': {
			textTransform: 'none',
		},
		'& > div': {
			fontSize: 16,
			fontWeight: 'bold',
		},
	},
	text: {
		marginTop: 15,
		height: 17,
		fontFamily: 'Roboto',
		fontSize: '14px !important',
		lineHeight: 1.21,
		color: '#000000',
		fontWeight: '500 !important',
	},
	leftIcon: {
		marginRight: 10,
	},
	descriptionContainer: {
		marginTop: 19,
		marginBottom: 18.5,
		'@media (min-width: 768px)': {
			marginBottom: 10.5,
		},
		'@media (min-width: 1284px)': {
			marginBottom: 32,
		},
	},
	descriptionTitle: {
		width: 96,
		height: 24,
		fontFamily: 'Roboto',
		fontSize: 20,
		fontWeight: 'bold',
		lineHeight: 1.2,
		letterSpacing: 0.4,
		textAlign: 'center',
		color: '#000000',
	},
	description: {
		width: '100%',
		minHeight: 35,
		fontSize: 20,
		marginTop: 8,
	},
	progressOuter: {
		width: '100%',
		height: 12,
		borderRadius: 8,
		border: '1px solid rgba(128, 0, 128, 0.2)',
		backgroundColor: '#ffffff',
		boxSixing: 'border-box',
		marginBottom: 18.5,
	},
	progressInner: {
		height: 12,
		borderRadius: 8,
		backgroundColor: '#800080',
	},
	titleText: {
		'& div': {
			maxWidth: 400,
			marginBottom: 0,
			display: '-webkit-box',
			WebkitBoxOrient: 'vertical',
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			textTransform: 'none',
		},
	},
	flexDeraction: {
		display: 'flex',
		[gtXsMediaQuery]: {
			flexDirection: 'row',
		},
		'@media (min-width: 768px) and (max-width: 1284px)': {
			flexDirection: 'row',
		},
		'@media (min-width: 1284px)': {
			flexDirection: 'column',
		},
	},
	streamerTitle: {
		marginBottom: 0,
		'& div': {
			fontWeight: 'bold',
			fontStyle: 'normal',
			fontStretch: 'normal',
			fontSize: 16,
		},
	},
	'mb-10': {
		marginBottom: 10,
	},
	sidebarItemText: {
		fontSize: 14,
	},
	pledgeButton: {
		marginBottom: 65,
	},
	youPledge: {
		marginTop: 7,
		fontSize: 12,
		fontWeight: 'bold',
		'& span': {
			fontWeight: 'normal',
		},
	},
	totalPledge: {
		marginTop: 10,
		smallText: {
			fontSize: 12,
			fontFamily: 'Roboto',
			textTransform: 'none',
		},
		bigText: {
			fontSize: 18,
			textTransform: 'none',
			fontFamily: 'Roboto',
		},
		deliveryDareButton: {
			'& span': {
				height: 24,
			},
			'& button': {
				color: '#800080',
				height: 48,
				borderRadius: 50,
				border: '1px solid #800080',
				background: 'white',
				'& div': {
					display: 'flex',
					flexDirection: 'column',
				},
			},
			'& button:hover': {
				background: 'white',
			},
		},
	},
}

export const ViewProjectModule = memo(({
	auditFavorites, removeToFavorites, favoritesAmount, myFavorites,
	projectId, projectDescription, projectTitle, pledgeAmount, assignees,
	gameImage, canApproveProject, canRejectProject, pushRoute, canPledgeProject,
	classes, isAuthenticated, canEditProjectDetails, updateProject,
	myPledge, status, canRejectActiveProject, pledgers, created, daysToGo, favoritesProcessing,
	userData = {}, approvedVideoUrl, isOneOfAssignees, projectAcceptanceStatus,
	goalProgress, projectDeliveries,
}) => {
	const [title, setTitle] = useState(projectTitle)
	const [description, setDescription] = useState(projectDescription)
	useEffect(() => {
		setTitle(projectTitle)
		setDescription(projectDescription)
	}, [projectTitle, projectDescription])
	return (
		<div className="flex layout-row layout-align-center-start">
			<MaxWidthContainer>
				<div className={classNames('flex flex-sm-70 layout-row layout-wrap', classes.centered)}>
					<div className={classNames(
						'flex-100', 'layout-row',
						'layout-align-center', classes.title,
					)}
					>
						{ternary(canEditProjectDetails,
							<TextField
								label="Title"
								type="text"
								value={title || ''}
								onChange={e => setTitle(e.target.value)}
								variant="outlined"
							/>,
							<div className={classes.titleText}>
								<Title>{title}</Title>
							</div>)}

					</div>
					<div className="flex-100 flex-gt-sm-55 flex-order-1">
						{ternary(projectDeliveries,
							<div className={classes.iframeContainer}>
								<iframe
									className={classes.iframe}
									src={prop('deliveryURL', projectDeliveries)}
									frameBorder="0"
									scrolling="no"
									allowFullScreen
									title={projectTitle}
								/>
							</div>,
							<img alt="Game" src={gameImage} className={classes.image} />)}
						<div className={classNames(
							'flex-100', 'flex-order-1', 'flex-order-gt-sm-3', 'flex-gt-sm-100',
							classes.descriptionContainer,
						)}
						>
							<div className={classNames(classes.descriptionTitle)}>Description</div>
							<div className={classNames('flex-100', 'layout-row')}>
								<div className={classNames('flex-100')}>
									{ternary(canEditProjectDetails,
										<TextField
											multiline
											value={description || ''}
											onChange={e => setDescription(e.target.value)}
											variant="outlined"
											fullWidth
										/>,
										<div className={classes.description}>{description}</div>)}
								</div>
								{orNull(canEditProjectDetails,
									<Button
										onClick={() => updateProject({ title, description, projectId })}
										isSmallButton
									>
										Save
									</Button>)}
							</div>
						</div>
					</div>
					<div
						className={classNames(
							'flex-100 flex-gt-sm-45',
							'flex-order-3 flex-order-gt-sm-2',
							'layout-column',
						)}
					>
						<div
							className={classNames(classes.sidebar, 'layout-column')}
						>
							<div className={classNames(classes.progressOuter)}>
								<div className={classNames(classes.progressInner)} style={{ width: `${goalProgress}%` }} />
								{!isNil(myPledge)
									&& (
										<div className={classNames(classes.youPledge)}>
											You Pledged: <span>${myPledge}</span>
										</div>
									)
								}
							</div>
							<div className={classNames('flex', 'layout-row', 'layout-wrap')}>
								<div className={classNames('flex-40', 'flex-gt-sm-100', classes.sidebarItem, classes.totalPledge)}>
									<SubHeader>Total Pledged</SubHeader>
									<div className={classNames(classes.text)}>{pledgeAmount}</div>
								</div>
								<div className={classNames('flex-30', 'flex-gt-sm-100', classes.sidebarItem)}>
									<SubHeader>Pledgers</SubHeader>
									<div className={classNames(classes.text)}>{pledgers}</div>
								</div>
								{orNull(
									daysToGo,
									<div className={classNames('flex-30', 'flex-gt-sm-50', classes.sidebarItem)}>
										<SubHeader>Days to go</SubHeader>
										<div className={classNames(classes.text)}>{daysToGo}</div>
									</div>,
								)}
							</div>
							<div className={classNames(classes.sidebarItem, classes.streamerTitle)}>
								<SubHeader>Streamer challenged: </SubHeader>
							</div>
							<div
								className={classNames(
									classes.sidebarItem,
									'layout-row layout-wrap',
								)}
							>
								{addIndex(map)((assignee, i) => (
									<Assignee key={i} {...assignee} />
								), assignees)}
							</div>
							{orNull(
								canApproveProject,
								<div className={classes.sidebarItem}>
									<RecordClickActionButton
										recordClickActionId={APPROVE_PROJECT}
										recordId={projectId}
									/>
								</div>,
							)}
							{
								orNull(
									canRejectProject,
									<div className={classes.sidebarItem}>
										<RecordClickActionButton
											recordClickActionId={REJECT_PROJECT}
											recordId={projectId}
										/>
									</div>,
								)
							}
							{
								<div className={classes.sidebarItem}>
									<Button
										onClick={ternary(
											isAuthenticated,
											goToPledgeProjectHandler({
												recordId: projectId,
												backPage: {
													routeId: VIEW_PROJECT_ROUTE_ID,
													routeParams: { recordId: projectId },
												},
											}, pushRoute),
											goToSignInHandler(pushRoute),
										)}
									>
										Pledge
									</Button>
								</div>
							}
							{
								orNull(
									canRejectActiveProject,
									<div className={classes.sidebarItem}>
										<RecordClickActionButton
											recordClickActionId={REJECT_ACTIVE_PROJECT}
											recordId={projectId}
										/>
									</div>,
								)
							}
							<ClaimButton
								projectAcceptanceStatus={projectAcceptanceStatus}
								projectId={projectId}
								assignees={assignees}
								pushRoute={pushRoute}
								isAuthenticated={isAuthenticated}
							/>
							<div className={classes.sidebarItem}>
								<LoadingButton
									buttonType="noBackgroundButton"
									loading={favoritesProcessing}
									onClick={
										ternary(
											isAuthenticated,
											auditFavorites,
											goToSignInHandler(pushRoute),
										)
									}
								>
									<FavoriteBorderIcon className={classes.leftIcon} />
									{ternary(myFavorites,
										'Added to your Favorites',
										'Add to Favorites')}({favoritesAmount === 'undefined' ? 0 : favoritesAmount})
								</LoadingButton>
							</div>
						</div>
					</div>
				</div>
			</MaxWidthContainer>
		</div>
	)
})

export default withModuleContext(
	viewProjectConnector(ViewProjectModule, styles),
)
