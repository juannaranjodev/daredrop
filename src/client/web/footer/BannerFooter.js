import React, { memo } from 'react'

import withModuleContext from 'root/src/client/util/withModuleContext'
import footerConnector from 'root/src/client/logic/footer/connectors/footerConnector'
import Link from 'root/src/client/web/base/Link'

import classNames from 'classnames'

import { orNull } from 'root/src/shared/util/ramdaPlus'

import facebook from 'root/src/client/assets/Facebook.jpg'
import twitter from 'root/src/client/assets/Twitter.jpg'
import instagram from 'root/src/client/assets/Instagram.jpg'
import youtube from 'root/src/client/assets/Youtube.jpg'
import vk from 'root/src/client/assets/VK.jpg'

import styles from './style'

export const BannerFooterUnconnected = memo(({ classes, bannerFooterImage, isSuccessPage }) => (
	<div className={classes.imageContainer}>
		{orNull(
			isSuccessPage,
			<div className={classes.socialContainer}>
				<div className={classes.socialIcon}>
					<Link href="https://www.facebook.com/daredrops">
						<img src={facebook} alt="facebook" />
					</Link>
				</div>
				<div className={classes.socialIcon}>
					<Link href="https://twitter.com/daredrops">
						<img src={twitter} alt="twitter" />
					</Link>
				</div>
				<div className={classes.socialIcon}>
					<Link href="https://www.youtube.com/channel/UC9HaIflzLYyMTWaoMyok3VQ">
						<img src={youtube} alt="youtube" />
					</Link>
				</div>
				<div className={classes.socialIcon}>
					<Link href="https://www.instagram.com/dare.drop/">
						<img src={instagram} alt="instagram" />
					</Link>
				</div>
				<div className={classes.socialIcon}>
					<Link href="https://www.twitch.tv/dare_drop">
						<img src={twitch} alt="twitch" />
					</Link>
				</div>
			</div>,
		)}
		<div className={classNames(classes.footerImg, 'flex layout-row')}>
			<div
				className={classNames(classes.bannerBg, 'flex')}
				style={{ backgroundImage: `url(${bannerFooterImage})` }}
			/>
		</div>
	</div>
))

export default withModuleContext(
	footerConnector(BannerFooterUnconnected, styles),
)
