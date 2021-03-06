import React, { memo } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from 'fortawesome-light/fontawesome-light'
import classNames from 'classnames'

import styled from 'root/src/client/web/base/StaticLayout/style'

const styles = {
	section: {
		...styled.section,
		lineHeight: '24px',
		'& p': {
			fontSize: 18,
			lineHeight: '24px',
		},
	},
	list: {
		...styled.list,
		fontSize: 16,
		lineHeight: '22px',
		paddingLeft: 30,
		'& li': {
			marginBottom: 12,
		},
	},
	container: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: 33,
		marginTop: 3,
	},
	stepComponent: {
		marginLeft: -8,
		display: 'flex',
		justifyContent: 'space-between',
		width: '85%',
		'@media (max-width: 1024px) ': {
			width: '95%',
		},
		height: 100,
	},
	arrow: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		marginBottom: '35px',
	},
	item: {
		display: 'flex',
		flexDirection: 'column',
		width: 160,
		height: 100,
		'& > img': {
			display: 'block',
			margin: '0 auto',
		},
	},
	itemText: {
		marginTop: 20,
		fontSize: 12,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	player: {
		height: 60,
		'@media (max-width: 600px) ': {
			height: 55,
		},
	},
	bubbles: {
		height: 60,
	},
	megaphone: {
		height: 60,
	},
	shadowBox: {
		width: '75%',
		display: 'flex',
		justifyContent: 'center',
		height: 140,
		alignItems: 'center',
		boxShadow: '0 3px 26px 0 rgba(0, 0, 0, 0.16)',
		'@media (max-width: 960px) ': {
			width: '90%',
		},
	},
}

const SubBanner = memo(({ classes }) => (
	<div className={classes.container}>
		<div className={classes.shadowBox}>
			<div className={classes.stepComponent}>
				<div className={classNames(classes.item, classes.megaphoneItem)}>
					<div className={classNames(classes.itemText, classes.dareAStreamer)}>
						DARE A STREAMER
					</div>
				</div>
				<div className={classes.arrow}>
					<FontAwesomeIcon icon={faAngleRight} color="rgba(128, 0, 128, 0.8)" size="lg" />
				</div>
				<div className={classes.item}>
					<div className={classNames(classes.itemText, classes.crowdfundYourDare)}>
						CROWDFUND YOUR DARE
					</div>
				</div>
				<div className={classes.arrow}>
					<FontAwesomeIcon icon={faAngleRight} color="rgba(128, 0, 128, 0.8)" size="lg" />
				</div>
				<div className={classes.item}>
					<div className={classNames(classes.itemText, classes.enjoyAwesomeContent)}>
						ENJOY AWESOME CONTENT
					</div>
				</div>
			</div>
		</div>
	</div>
))

export default withStyles(styles)(SubBanner)
