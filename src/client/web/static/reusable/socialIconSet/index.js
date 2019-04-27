import React, { memo } from 'react'

import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faFacebookF,
	faTwitter,
	faYoutube,
	faInstagram,
	faVk,
} from '@fortawesome/free-brands-svg-icons'
import clipboard from 'root/src/client/assets/icons/clipboard.png'
import AddToClipboardButton from 'root/src/client/web/base/AddToClipboardButton'

import {
	TwitterShareButton, FacebookShareButton, RedditShareButton, VKShareButton, RedditIcon,
} from 'react-share'

import classNames from 'classnames'

import styles from './style'

const socialIconSet = memo(({ classes, url }) => (
	<div className={classes.SocialContainer}>
		<FacebookShareButton url={url} className={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Facebook)}>
				<FontAwesomeIcon className={classes.icon} icon={faFacebookF} size="2x" color="#ffffff" />
			</div>
		</FacebookShareButton>
		<TwitterShareButton url={url} className={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Twitter)}>
				<FontAwesomeIcon className={classes.icon} icon={faTwitter} size="2x" color="#ffffff" />
			</div>
		</TwitterShareButton>
		<RedditShareButton url={url} className={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Reddit)}>
				<RedditIcon className={classes.icon} size={56} round />
			</div>
		</RedditShareButton>
		<VKShareButton url={url} className={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.VK)}>
				<FontAwesomeIcon className={classes.icon} icon={faVk} size="2x" color="#ffffff" />
			</div>
		</VKShareButton>
		<AddToClipboardButton url={url} className={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.clipboard)}>
				<img src={clipboard} width="32px" alt="add_to_clipboard" />
			</div>
		</AddToClipboardButton>
	</div>
))

export default withStyles(styles)(socialIconSet)
