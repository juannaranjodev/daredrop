import React, { memo } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ShareIcon from '@material-ui/icons/Share'
import clipboard from 'root/src/client/assets/icons/clipboard.png'
import withStyles from '@material-ui/core/styles/withStyles'
import AddToClipboardButton from 'root/src/client/web/base/AddToClipboardButton'

import {
	TwitterShareButton, FacebookShareButton, RedditShareButton, VKShareButton,
	TwitterIcon, FacebookIcon, RedditIcon, VKIcon,
} from 'react-share'

const ShareMenuItems = memo(({ url }) => [
	<MenuItem key="twitter">
		<TwitterShareButton url={url}>
			<div className="layout-row layout-align-start-center">
				<TwitterIcon size={32} round />{'\u00A0'}
				<span>Share on Twitter</span>
			</div>
		</TwitterShareButton>
	</MenuItem>,
	<MenuItem key="facebook">
		<FacebookShareButton url={url}>
			<div className="layout-row layout-align-start-center">
				<FacebookIcon size={32} round />{'\u00A0'}
				<span>Share on Facebook</span>
			</div>
		</FacebookShareButton>
	</MenuItem>,
	<MenuItem key="reddit">
		<RedditShareButton url={url}>
			<div className="layout-row layout-align-start-center">
				<RedditIcon size={32} round />{'\u00A0'}
				<span>Share on Reddit</span>
			</div>
		</RedditShareButton>
	</MenuItem>,
	<MenuItem key="vk">
		<VKShareButton url={url}>
			<div className="layout-row layout-align-start-center">
				<VKIcon size={32} round />{'\u00A0'}
				<span>Share on VK</span>
			</div>
		</VKShareButton>
	</MenuItem>,
	<MenuItem key="clipboard">
		<AddToClipboardButton url={url}>
			<div className="layout-row layout-align-start-center">
				<img src={clipboard} width="32px" alt="add_to_clipboard" />{'\u00A0'}
				<span>Copy to clipboard</span>
			</div>
		</AddToClipboardButton>
	</MenuItem>,
])

const styles = {
	iconColor: {
		color: 'white',
		'&:hover': {
			color: '#ddd',
		},
	},
}

export default withStyles(styles)(memo(({ classes, url, onClose, onOpen }) => {
	const [anchorEl, setAnchorEl] = React.useState(null)
	const open = Boolean(anchorEl)

	const handleClick = (event) => { onOpen(); return setAnchorEl(event.currentTarget) }

	const handleClose = () => { onClose(); return setAnchorEl(null) }

	return (
		<div>
			<IconButton
				aria-label="More"
				aria-haspopup="true"
				onClick={handleClick}
				className={classes.iconColor}
			>
				<ShareIcon />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				<ShareMenuItems url={url} />
			</Menu>
		</div>
	)
}))
