import React, { memo } from 'react'

import Link from 'root/src/client/web/base/Link'

import withStyles from '@material-ui/core/styles/withStyles'
import classNames from 'classnames'
import { orNull } from 'root/src/shared/util/ramdaPlus'

import SocialIconSet from 'root/src/client/web/static/reusable/socialIconSet'

import styles from './style'


const SuccessPage = memo(({ classes, pageContent, sharedUrl }) => (
	<div className="flex layout-column layout-align-space-between">
		<section className={classes.section}>
			<div className={classes.content}>
				<h3 className={classes.sectionTitle}>{pageContent.title}</h3>
				<ul className={classes.list}>
					{pageContent.paragraphs.map((paragraph, idx) => (
						<li key={idx}>{paragraph}</li>
					))}
				</ul>
				<Link routeId={pageContent.link}>
					<p className={classes.link}>{pageContent.linkLabel}</p>
				</Link>
			</div>
		</section>
		<div className={classes.space} />
		<div
			style={{ backgroundImage: `url(${pageContent.bannerFooterImage}` }}
			className={classNames(classes.imageWrapper, 'flex flex-column layout-align-end')}
		>
			<div className={classes.imageContainer}>
				<SocialIconSet className={classes.icons} url={sharedUrl} />
			</div>
		</div>
	</div>
))

export default withStyles(styles)(SuccessPage)
