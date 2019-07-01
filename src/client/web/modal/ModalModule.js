import React, { memo } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

import withModuleContext from 'root/src/client/util/withModuleContext'
import RejectDareModal from 'root/src/client/web/modal/RejectDareModal'
import modalModuleConnector from 'root/src/client/logic/modal/connectors/modalModuleConnector'
import styles from './styles'

const renderModal = (modalType, props) => {
	switch (modalType) {
		case 'rejectProjectModal':
			return <RejectDareModal props={props} />
		default:
			return null
	}
}

export const ModalModuleUnconnected = memo(({
	classes, modalType, modalTitle, modalText, modalVisible, moduleId, displayModal, ...props
}) => (
	<div
		onClick={() => displayModal(moduleId, false)}
		className={modalVisible ? classes.backdrop : classes.hide}
	>
		<div
			onClick={e => e.stopPropagation()}
			className={classes.modal}
		>
			<div className={classes.closeContainer}>
				<button
					onClick={() => displayModal(moduleId, false)}
					className={classes.close}
				>
					<FontAwesomeIcon icon={faTimesCircle} size="lg" color="#000000" />
				</button>
			</div>
			<div className={classes.contentContainer}>
				<div className={classes.container}>
		<div className={classes.content}>
						<div className={classes.title}>{modalTitle}</div>
						<div className={classes.text}>
							{modalText}
							{renderModal(modalType, { displayModal, moduleId, ...props })}
						</div>
					</div>
 </div>
			</div>
		</div>
	</div>
))


export default withModuleContext(modalModuleConnector(ModalModuleUnconnected, styles))
