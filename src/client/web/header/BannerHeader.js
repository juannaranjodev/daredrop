import React, { memo, Fragment } from 'react'
import classNames from 'classnames'

import { orNull } from 'root/src/shared/util/ramdaPlus'
import search from 'root/src/client/assets/icons/search.svg'
import Link from 'root/src/client/web/base/Link'
import Header from 'root/src/client/web/typography/Header'
import Title from 'root/src/client/web/typography/Title'
import SubTitle from 'root/src/client/web/typography/SubTitle'

import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import withModuleContext from 'root/src/client/util/withModuleContext'
import SvgIcon from '@material-ui/core/SvgIcon'
import Select, { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'

import bannerHeaderConnector from 'root/src/client/logic/header/connectors/bannerHeaderConnector'

import { primaryColor, secondaryColor } from 'root/src/client/web/commonStyles'

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
		'&:hover': {
			color: secondaryColor,
		},
	},
	filterContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		width: '50%',
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
	},
	autoSelect: {
		width: 152,
		height: 29,
		marginLeft: 25,
		boxShadow: '0 0 26px 0 rgba(0, 0, 0, 0.16)',
	},
	createLinkContainer: {
		width: '50%',
	},
	linkAndFilterContainer: {
		display: 'flex',
		justifyContent: 'spase-between',
	},
}

const DropdownIndicator = props => (
	<components.DropdownIndicator {...props}>
		<SvgIcon>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
				<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
				<path d="M0 0h24v24H0z" fill="none" />
			</svg>
		</SvgIcon>
	</components.DropdownIndicator>
)


export const BannerHeaderUnconnected = memo(({
	bannerImage, bannerImageText, bannerImageSubText,
	textWithBg, bannerSubText, linkLabel, linkRouteId,
	classes, createNewDareActive, loadOptionsPromise,
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
				<div className="flex layout-column">
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
						{orNull(
							createNewDareActive,
							<div className={classes.filterContainer}>
								<div className={classes.sort}>
									<div className={classes.label}>Sort By:</div>
									<Select
										defaultValue={{
											label: 'Newest',
											id: 0,
											value: 0,
										}}
										className={classes.autoSelect}
										options={[
											{ 	label: 'Newest',
												id: 0,
												value: 0,
											},
											{ 	label: 'Accepted',
												id: 1,
												value: 1,
											},
											{ 	label: 'Bounty Amount',
												id: 2,
												value: 2,
											},
											{ 	label: 'Time Left',
												id: 3,
												value: 3,
											},
										]}
										styles={{
											control: () => ({
												width: 152,
												height: 29,
												border: 'none',
											}),
											dropdownIndicator: () => ({
												position: 'absolute',
												top: 5,
												right: 0,
												fontWeight: 400,
											}),
										}}
									/>
								</div>
								<div className={classes.filter}>
									<div className={classes.label}>Filter By:</div>
									<div className={classes.filterBclock}>
										<AsyncSelect
											cacheOptions
											loadOptions={loadOptionsPromise('twitchGames')}
											defaultOptions
											placeholder="Filter game"
											styles={{
												control: () => ({
													border: 'none',
												}),
												dropdownIndicator: () => ({
													position: 'absolute',
													top: 7,
													right: 0,
													fontWeight: 400,
												}),
											}}
											className={classes.autoSelect}
											onInputChange={() => {}}
											components={{
												DropdownIndicator,
											}}
										/>
										<AsyncSelect
											cacheOptions
											loadOptions={loadOptionsPromise('twitchChannels')}
											defaultOptions
											placeholder="Filter streamer"
											styles={{
												control: () => ({
													border: 'none',
												}),
												dropdownIndicator: () => ({
													position: 'absolute',
													top: 7,
													right: 0,
												}),
											}}
											className={classes.autoSelect}
											onInputChange={() => {}}
											components={{
												DropdownIndicator,
											}}
										/>
									</div>
								</div>
							</div>,
						)}
					</div>
				</div>
			</MaxWidthContainer>
		</div>
	</div>
))

export default withModuleContext(
	bannerHeaderConnector(BannerHeaderUnconnected, styles),
)
