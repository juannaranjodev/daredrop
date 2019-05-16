import { propOr, prop } from 'ramda'
import React, { memo, useState } from 'react'
import classNames from 'classnames'

import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import Title from 'root/src/client/web/typography/Title'
import SubHeader from 'root/src/client/web/typography/SubHeader'

import RecordClickActionButton from 'root/src/client/web/base/RecordClickActionButton'
import { APPROVE_PROJECT, REJECT_PROJECT } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'

import viewProjectConnector from 'root/src/client/logic/project/connectors/viewProjectConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'

import { outlinedButton, primarySquareButton } from 'root/src/client/web/componentTypes'
import styles from './reviewProjectStyle'


export const ViewProjectModule = memo(({
	projectId, projectDescription, projectTitle,
	classes, projectDeliveries,
}) => {
	const [rejectDescription, setRejectDescription] = useState('')
	return (
		<div className="flex layout-row layout-align-center-start">
			<MaxWidthContainer>
				<div className={classNames('flex flex-sm-70 layout-row layout-wrap', classes.centered)}>
					<div className={classNames(
						'flex-100', 'layout-row',
						'layout-align-center', classes.title,
					)}
					>
						<div className={classes.titleText}>
							<Title>{projectTitle}</Title>
						</div>
					</div>
					<div className="flex-100 flex-gt-sm-55 flex-order-1">
	<div className={classes.iframeContainer}>
							<iframe
	className={classes.iframe}
								src={prop('videoURL', propOr(null, 0, projectDeliveries))}
	frameBorder="0"
	scrolling="no"
	allowFullScreen
								title={projectTitle}
							/>
						</div>
						<div className={classNames(
							'flex-100', 'flex-order-1', 'flex-order-gt-sm-3', 'flex-gt-sm-100',
							classes.descriptionContainer,
						)}
						>
							<div className={classNames(classes.descriptionTitle)}>Description</div>
							<div className={classNames('flex-100', 'layout-row')}>
								<div className={classNames('flex-100')}>
	<div className={classes.description}>
	{projectDescription}
									</div>
								</div>
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
							<div className={classNames('flex-40', 'flex-gt-sm-100', classes.sidebarItem, classes.totalPledge)}>
	<SubHeader>Time Dare Started:</SubHeader>
								<div className={classNames(classes.text)}>{prop('timeStamp', propOr(null, 0, projectDeliveries))}</div>
							</div>
	<div className={classes.sidebarItem}>
	<RecordClickActionButton
	recordClickActionId={APPROVE_PROJECT}
	recordId={projectId}
	buttonType={primarySquareButton}
								/>
								<SubHeader>
         Reject Reason<span className={classes.red}>*</span>:
</SubHeader>
								<textarea
	className={classNames(classes.rejectDescription, classes['mb-10'])}
	placeholder="Reject reason"
									value={rejectDescription}
									onChange={e => setRejectDescription(e.target.value)}
								/>
								<RecordClickActionButton
									recordClickActionId={REJECT_PROJECT}
									recordId={projectId}
									buttonType={outlinedButton}
								/>
								<SubHeader className={classes.reason}>
         If you can't decide what to do please email your supervisor with the URL of the Dare.
</SubHeader>
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
