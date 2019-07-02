import React, { memo, Fragment } from 'react'
import { and, not } from 'ramda'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { SORT_BY_BOUNTY, SORT_BY_TIME_LEFT, SORT_BY_NEWEST } from 'root/src/shared/constants/sortTypesOfProject'

import { orNull } from 'root/src/shared/util/ramdaPlus'
import Link from 'root/src/client/web/base/Link'
import Header from 'root/src/client/web/typography/Header'
import Title from 'root/src/client/web/typography/Title'
import SubTitle from 'root/src/client/web/typography/SubTitle'

import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import withModuleContext from 'root/src/client/util/withModuleContext'

import SvgIcon from '@material-ui/core/SvgIcon'
import Chip from '@material-ui/core/Chip'
import CancelIcon from '@material-ui/icons/Cancel'

import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'

import bannerHeaderConnector from 'root/src/client/logic/header/connectors/bannerHeaderConnector'
import getValueChip from 'root/src/client/logic/header/handlers/getValueChip'

import { primaryColor, secondaryColor } from 'root/src/client/web/commonStyles'
import Fields from 'root/src/client/web/form/Fields'
import EmbededModule from 'root/src/client/web/embeded/EmbededModule'

const styles = {
	bottomMargin: {
		marginBottom: 22,
	},
	banner: {
		height: 300,
		position: 'relative',
	},
	bannerBg: {
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundColor: 'black',
	},
	textOverlay: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		textAlign: 'center',
		position: 'absolute',
		color: 'white',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	textBox: {
		padding: '16px 0',
		backgroundColor: 'rgba(128, 0, 128, 0.7)',
		borderRadius: 30,
		margin: '0 auto',
		maxWidth: 405,

		'@media (max-width: 750px)': {
			maxWidth: 360,
		},

		'@media (max-width: 600px)': {
			maxWidth: 345,
		},
	},
	overlay: {
		backgroundColor: 'rgba(128, 0, 128, 0.41)',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		position: 'absolute',
	},
	newDare: {
		fontSize: 18,
		letterSpacing: 1,
		fontWeight: 'bold',
		color: primaryColor,
		position: 'absolute',
		'&:hover': {
			color: secondaryColor,
		},
	},
	filterContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		width: '50%',
		'@media (max-width: 414px)': {
			marginTop: 40,
		},
		'@media (max-width: 1024px)': {
			marginTop: 30,
		},
		'@media (max-width: 364px)': {
			flexDirection: 'column',
			marginTop: 40,
			width: '60%',
		},
	},
	label: {
		fontSize: 14,
		marginLeft: 25,
		marginBottom: 8,
	},
	input: {
		height: 29,
		width: 159,
		borderRadius: 5,
		boxShadow: '0 0 26px 0 rgba(0, 0, 0, 0.16)',
		'& fieldset': {
			borderColor: 'white',
		},
		marginLeft: 25,
	},
	filterBclock: {
		display: 'flex',
		'@media (max-width: 560px)': {
			flexDirection: 'column',
		},
	},
	autoSelect: {
		width: 152,
		height: 29,
		marginLeft: 25,
		marginBottom: 12,
		boxShadow: '0 0 26px 0 rgba(0, 0, 0, 0.16)',
	},
	createLinkContainer: {
		width: '50%',
		height: '20px',
		'@media (max-width: 364px)': {
			flexDirection: 'column',
			marginTop: 0,
			width: '13%',
		},
	},
	linkAndFilterContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		'@media (max-width: 631px)': {
			flexDirection: 'column',
		},
	},
	sort: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
}

export const BannerHeaderUnconnected = memo(({
	bannerImage, bannerImageText, bannerImageSubText,
	textWithBg, bannerSubText, linkLabel, linkRouteId,
	classes, createNewDareActive, loadOptionsPromise,
	filterProjectByGame, filterProjectByStreamer,
	gameFilterValue, streamerFilterValue,
	isMyProjects, embededContent,
}) => (
		<div className={classNames(classes.bottomMargin, 'layout-column')}>
			{orNull(bannerImage,
				(
					<div
						className={classNames(classes.banner, 'layout-row')}
					>
						<div
							className={classNames(classes.bannerBg, 'flex')}
							style={{ backgroundImage: `url(${bannerImage})` }}
						/>
						<div className={classes.overlay} />
						<div className={classes.textOverlay}>
							<div className={classNames({ [classes.textBox]: textWithBg })}>
								<Title>{bannerImageText}</Title>
								<SubTitle>{bannerImageSubText}</SubTitle>
							</div>
						</div>
					</div>
				))
			}
			<div className="layout-row layout-align-center">
				<MaxWidthContainer>
					<div className={classNames('flex layout-column', classes.embedModuleContainer)}>
						<div className="layout-row layout-align-center">
							<Header>{bannerSubText}</Header>
						</div>
						<div className={classes.linkAndFilterContainer}>
							{orNull(
								createNewDareActive,
								<div className={classes.createLinkContainer}>
									<Link routeId={linkRouteId}>
										<span className={classes.newDare}>{linkLabel}</span>
									</Link>
								</div>,
							)}
							{orNull(embededContent,
								<EmbededModule {...embededContent} />)}
						</div>
					</div>
				</MaxWidthContainer>
			</div>
		</div>
	))

export default withModuleContext(
	bannerHeaderConnector(BannerHeaderUnconnected, styles),
)
