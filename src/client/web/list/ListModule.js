import { map, head, last } from 'ramda'
import React, { memo, useState } from 'react'

import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroller'
import PaymentMethod from 'root/src/client/web/list/PaymentMethod'
import ProjectCard from 'root/src/client/web/list/ProjectCard'
import MaxWidthContainer from 'root/src/client/web/base/MaxWidthContainer'
import withModuleContext from 'root/src/client/util/withModuleContext'
import { listStyle } from 'root/src/client/web/list/style'
import Title from 'root/src/client/web/typography/Title'
import SubTitle from 'root/src/client/web/typography/SubTitle'
import LinkButton from 'root/src/client/web/base/LinkButton'

import List from '@material-ui/core/List'

import listModuleConnector from 'root/src/client/logic/api/connectors/listModuleConnector'

import { DeletePaymentModal } from './DeletePaymentModal'

export const CardList = ({
	list, currentPage, hasMore, classes, getNextPage,
}) => {
	const [timeouts, setTimeouts] = useState([])
	return (
		<div className="flex layout-row layout-align-center-start">
			<MaxWidthContainer>
				<div className="flex layout-row layout-align-center">
					<InfiniteScroll
						pageStart={0}
						loadMore={() => getNextPage(currentPage, hasMore)}
						hasMore={hasMore}
					>
						<div
							className={classNames(
								classes.paddingOffset,
								'layout-row layout-wrap',
							)}
						>
							{map(recordId => (
								<ProjectCard
									timeouts={timeouts}
									setTimeouts={setTimeouts}
									key={recordId}
									recordId={recordId}
									filterList={list[1]}
									acceptedList={list[2]}
								/>
							), head(list))}

						</div>
					</InfiniteScroll>
				</div>
			</MaxWidthContainer>
		</div>
	)
}

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
