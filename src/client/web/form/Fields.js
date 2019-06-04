import React, { memo } from 'react'

import TextField from 'root/src/client/web/form/TextField'
import SubForm from 'root/src/client/web/form/SubForm'
import AmountNumber from 'root/src/client/web/form/AmountNumber'
import StripeCard from 'root/src/client/web/form/StripeCard'
import AutoComplete from 'root/src/client/web/form/AutoComplete'
import AttachmentInput from 'root/src/client/web/form/AttachmentInput'
import TimeStampInput from 'root/src/client/web/form/TimeStampInput'
import InputWrapper from 'root/src/client/web/form/InputWrapper'

const Fields = memo(({
	formFieldTypes, moduleKey, formType, wasSubmitted, moduleId,
}) => formFieldTypes.map(([
	fieldPath,
	fieldDescPath,
	inputType,
	fieldId,
	subFieldText,
	labelFieldText,
	fieldValue,
	fieldMax,
	subTextLabel,
]) => {
	const wrapperProps = {
		subFieldText,
		labelFieldText,
		key: fieldId,
		formType,
		subTextLabel,
	}
	const props = {
		fieldType: inputType,
		fieldId,
		fieldDescPath,
		moduleKey,
		fieldPath,
		formType,
		fieldValue,
		fieldMax,
		wasSubmitted,
		moduleId,
	}
	switch (inputType) {
		case 'text':
		case 'email':
		case 'password':
		case 'number':
			return (
				<InputWrapper {...wrapperProps}>
					<TextField {...props} />
				</InputWrapper>
			)
		case 'amountNumber':
			return (
				<InputWrapper {...wrapperProps}>
					<AmountNumber {...props} />
				</InputWrapper>
			)
		case 'subForm':
			return (
				<InputWrapper {...wrapperProps}>
					<SubForm {...props} />
				</InputWrapper>
			)
		case 'stripeCard':
			return (
				<InputWrapper {...wrapperProps}>
					<StripeCard {...props} />
				</InputWrapper>
			)
		case 'autoComplete':
			return (
				<InputWrapper {...wrapperProps}>
					<AutoComplete {...props} />
				</InputWrapper>
			)
		case 'attachmentInput':
			return (
				<InputWrapper {...wrapperProps}>
					<AttachmentInput {...props} />
				</InputWrapper>
			)
		case 'timeStamp':
			return (
				<InputWrapper {...wrapperProps}>
					<TimeStampInput {...props} />
				</InputWrapper>
			)
		default:
			return (
				<div key={fieldId}>
					<p>inputType: {inputType}</p>
				</div>
			)
	}
}))

export default Fields
