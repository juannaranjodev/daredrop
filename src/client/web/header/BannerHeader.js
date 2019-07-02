import classNames from 'classnames'
import React, { memo } from 'react'
import bannerHeaderConnector from 'root/src/client/logic/header/connectors/bannerHeaderConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import Link from 'root/src/client/web/base/Link'
import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import { primaryColor, secondaryColor } from 'root/src/client/web/commonStyles'
import EmbededModule from 'root/src/client/web/embeded/EmbededModule'
import Header from 'root/src/client/web/typography/Header'
import SubTitle from 'root/src/client/web/typography/SubTitle'
import Title from 'root/src/client/web/typography/Title'
import { orNull } from 'root/src/shared/util/ramdaPlus'

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
	createLinkContainer: {
		width: '50%',
		height: '20px',
		'@media (max-width: 364px)': {
			flexDirection: 'column',
			marginTop: 0,
			width: '13%',
		},
	},
	embededModuleAndLinkContainer: {
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
					<div className={classes.embededModuleAndLinkContainer}>
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
