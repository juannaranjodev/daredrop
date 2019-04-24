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
		<FacebookShareButton url={url} class={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Facebook)}>
				<FontAwesomeIcon class={classes.icon} icon={faFacebookF} size="2x" color="#ffffff" />
			</div>
		</FacebookShareButton>
		<TwitterShareButton url={url} class={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Twitter)}>
				<FontAwesomeIcon class={classes.icon} icon={faTwitter} size="2x" color="#ffffff" />
			</div>
		</TwitterShareButton>
		<RedditShareButton url={url} class={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.Reddit)}>
				<RedditIcon class={classes.icon} size={56} round />
			</div>
		</RedditShareButton>
		<VKShareButton url={url} class={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.VK)}>
				<FontAwesomeIcon class={classes.icon} icon={faVk} size="2x" color="#ffffff" />
			</div>
		</VKShareButton>
		<AddToClipboardButton url={url} class={classes.sharedButton}>
			<div className={classNames(classes.SocialIcon, classes.clipboard)}>
				<img src={clipboard} width="32px" alt="add_to_clipboard" />
			</div>
		</AddToClipboardButton>
	</div>
))

export default withStyles(styles)(socialIconSet)
