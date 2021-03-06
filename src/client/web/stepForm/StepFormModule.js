import React, { memo } from 'react'

import Stepper from '@material-ui/core/Stepper'
import Form from 'root/src/client/web/form/Form'
import Submits from 'root/src/client/web/form/Submits'
import LoadingButton from 'root/src/client/web/base/LoadingButton'
import CustomSubmits from 'root/src/client/web/form/CustomSubmits'
import Header from 'root/src/client/web/typography/Header'
import Button from 'root/src/client/web/base/Button'
import stepFormModuleConnector from 'root/src/client/logic/form/connectors/stepFormModuleConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import { orNull, ternary } from 'root/src/shared/util/ramdaPlus'
import CircularProgress from '@material-ui/core/CircularProgress'

import classNames from 'classnames'
import loadingBlockStyle from 'root/src/client/web/base/commonStyle/loadingBlockStyle'

const styles = {
	space: {
		marginTop: 25,
		marginBottom: 25,
		textTransform: 'none',
	},
	formContainer: {
		width: 360,
		marginBottom: 50,

		'@media (max-width: 600px)': {
			width: 340,
		},
	},
	submits: {
		marginTop: 25,
		marginBottom: 25,

		'& span': {
			textTransform: 'none',
		},
	},
	backButton: {
		textAlign: 'center',
		marginBottom: 35,
		'& span': {
			backgroundColor: 'white',
		},

	},
	backButtonText: {
		color: '#800080',
		textTransform: 'none',
		fontSize: 18,
		zIndex: 2,
	},
	...loadingBlockStyle,
}

export const StepFormModuleUnconnected = memo(({
	classes,
	formSubmits, submitForm,
	moduleKey, moduleId, moduleIndex,
	stepFormCurrentPage, onLastStep, onFirstStep, onStep,
	stepFormNextPage, stepFormPrevPage, savePartialForm,
	customSubmits, customSubmitsData, payPalCreateOrder,
	payPalOnApprove, payPalOnError, visibleLoadingBlock,
}) => (
	<div className="flex layout-row layout-align-center">
		{visibleLoadingBlock && (
			<div className={classes.loadingContainer}>
				<div className={classes.loadingBlock}>
					<div className={classes.loadingText}>Loading...</div>
					<CircularProgress
						size={24}
						className={classes.loading}
					/>,
     </div>
			</div>
		)}
		<div className={classes.formContainer}>
			<div
				className={classNames(
					classes.space,
					'layout-row layout-align-center',
				)}
			>
				<Header>{ternary(onFirstStep, 'Dare a Streamer', 'Payment Information')}</Header>
			</div>
			<Form
				formIndex={stepFormCurrentPage}
				moduleKey={moduleKey}
				moduleId={moduleId}
				moduleIndex={moduleIndex}
			/>
			{orNull(
				!onLastStep,
				<LoadingButton
					className={classes.submits}
					loading={false}
					onClick={() => {
						savePartialForm(moduleKey, stepFormNextPage)
					}}
				>
					<span className={classes.transformNone}>
							Next
					</span>
				</LoadingButton>,
			)}
			{orNull(
				onLastStep,
				<div className={classes.submits}>
					<Submits
						moduleKey={moduleKey}
						formSubmits={formSubmits}
						submitFormFn={submitForm}
					/>
					{orNull(customSubmits,
						<CustomSubmits
							moduleKey={moduleKey}
							customSubmits={customSubmits}
							customSubmitsData={customSubmitsData}
							payPalCreateOrder={payPalCreateOrder}
							payPalOnApprove={payPalOnApprove}
							payPalOnError={payPalOnError}
						/>)}
				</div>,
			)}
			{orNull(
				!onFirstStep,
				<div className={classes.backButton}>
					<Button
						unstyled
						onClick={() => {
							stepFormPrevPage(moduleKey)
						}}
					>
						<span className={classes.backButtonText}>
								Go Back
						</span>
					</Button>
				</div>,
			)}
		</div>
	</div>
))

export default withModuleContext(
	stepFormModuleConnector(StepFormModuleUnconnected, styles),
)
