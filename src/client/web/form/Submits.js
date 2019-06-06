import React, { memo, Fragment } from 'react'

import LoadingButton from 'root/src/client/web/base/LoadingButton'

import submitFormHandler from 'root/src/client/logic/form/handlers/submitFormHandler'
import { orNull } from 'root/src/shared/util/ramdaPlus'
import { and } from 'ramda'
import ProgressBar from 'root/src/client/web/form/ProgressBar'
import ProgressNumber from 'root/src/client/web/form/ProgressNumber'

export const SubmitsUnstyled = memo(({
	formSubmits, moduleKey, submitFormFn, formType, setWasSubmitted, classes, uploadProgress,
}) => (
	<div>
		{formSubmits.map(([label, submitIndex, submitting, buttonType, hasUploadProgress]) => (
			<Fragment key={submitIndex}>
				<LoadingButton
					loading={submitting}
					onClick={
						submitFormHandler(submitFormFn, moduleKey, submitIndex, setWasSubmitted)
					}
					formType={formType}
					buttonType={buttonType}
				>
					{label}
				</LoadingButton>
				{orNull(and(hasUploadProgress, uploadProgress),
					<Fragment>
						<ProgressNumber uploadProgress={uploadProgress}/>
						<ProgressBar uploadProgress={uploadProgress} />
					</Fragment>)}
			</Fragment>
		))}
	</div>
))

export default SubmitsUnstyled
