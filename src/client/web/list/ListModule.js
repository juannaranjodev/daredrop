import { map, head, last, length, gt, compose, __, not } from 'ramda'
import React, { memo, useState } from 'react'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'

import { ternary } from 'root/src/shared/util/ramdaPlus'
import PaymentMethod from 'root/src/client/web/list/PaymentMethod'
import ProjectCard from 'root/src/client/web/list/ProjectCard'
import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import withModuleContext from 'root/src/client/util/withModuleContext'
import { listStyle } from 'root/src/client/web/list/style'
import Title from 'root/src/client/web/typography/Title'
import SubTitle from 'root/src/client/web/typography/SubTitle'
import LinkButton from 'root/src/client/web/base/LinkButton'
import SvgIcon from '@material-ui/core/SvgIcon'
import scrollTopHandler from 'root/src/client/logic/list/handlers/goTopHandler'
import List from '@material-ui/core/List'

import listModuleConnector from 'root/src/client/logic/api/connectors/listModuleConnector'

import { DeletePaymentModal } from './DeletePaymentModal'

export const CardList = ({
	list, currentPage, hasMore, classes, getNextPage,
}) => (
		<div className="flex layout-row layout-align-center-start">
			<MaxWidthContainer>
				<div className={classNames(classes.listModuleContainer, 'flex', 'layout-row', 'layout-align-center')}>
					<InfiniteScroll
						pageStart={0}
						loadMore={() => getNextPage(currentPage, hasMore)}
						hasMore={hasMore}
					>
						{ternary(
							compose(gt(__, 0), length, head),
							(
								<div
									className={classNames(
										classes.paddingOffset,
										'layout-row layout-wrap',
									)}
								>
									{map(recordId => (
										<ProjectCard
											key={recordId}
											recordId={recordId}
											filterList={list[1]}
											acceptedList={list[2]}
										/>
									), head(list))}

								</div>
							),
							(
								<div>
									Nothing found
								</div>
							),
						)}
					</InfiniteScroll>
					<div className={classes.goTopContainer} onClick={scrollTopHandler}>
						<div>
							<div className={classes.iconContainer}>
								<SvgIcon>
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
										<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
										<path d="M0 0h24v24H0z" fill="none" />
									</svg>
								</SvgIcon>
							</div>
							<div>
								Go to Top
						</div>
						</div>
					</div>
				</div>
			</MaxWidthContainer>
		</div>
	)

const UniversalList = ({
	list, classes, listTitle, listSubtitle, listControls, deletePaymentMethod, setDefaultPaymentMethod,
}) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [modalRecordId, setModalRecordId] = useState(null)
	return (
		<List className={classNames('layout-column layout-align-start-center', classes.list)}>
			<DeletePaymentModal
				open={modalOpen}
				closeModal={() => {
					setModalRecordId(null)
					setModalOpen(false)
				}}
				classes={classes}
				modalRecordId={modalRecordId}
				deletePaymentMethod={deletePaymentMethod}
			/>
			<Title notUpperCase>{listTitle}</Title>
			<SubTitle additionalClass={classes.subtitle}>{listSubtitle}</SubTitle>
			{
				compose(not, gt(__, 0), length, last)(list) && <div className={classes.noPaymentMessage}>No payment method saved</div>
			}
			{map(recordId => (
				<PaymentMethod
					key={recordId}
					recordId={recordId}
					openModal={async () => {
						setModalRecordId(recordId)
						setModalOpen(true)
					}}
					onClick={setDefaultPaymentMethod}
				/>
			), last(list))}
			<div className={classes.buttons}>
				{map(({ title, routeId, buttonType, subTitle }) => (
					<LinkButton
						type="button"
						key={title}
						buttonType={buttonType}
						routeId={routeId}
						isStyled
						disableRipple={buttonType === 'noBackgroundButton'}
					>
						<div>
							<div>{title}</div>
							<span className="button-subtitle">{subTitle}</span>
						</div>
					</LinkButton>
				),
					listControls)}
			</div>
		</List>
	)
}

export const ListModuleUnconnected = memo((props) => {
	switch (props.listType) {
		case 'card':
			return CardList(props)
		case 'list':
			return UniversalList(props)
		default:
			return (
				<List>
					{map(recordId => (
						<ProjectCard key={recordId} recordId={recordId} filterList={props.list[0]} />
					), last(props.list))}
				</List>
			)
	}
})

export default withModuleContext(
	listModuleConnector(ListModuleUnconnected, listStyle),
)
