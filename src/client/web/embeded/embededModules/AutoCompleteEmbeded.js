import Chip from '@material-ui/core/Chip'
import { withStyles } from '@material-ui/core/styles'
import SvgIcon from '@material-ui/core/SvgIcon'
import CancelIcon from '@material-ui/icons/Cancel'
import 'create-react-class'
import React, { memo } from 'react'
import { components } from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import Tappable from 'react-tappable/lib/Tappable'
import autoCompleteConnector from 'root/src/client/logic/form/connectors/autoCompleteConnector'
import getValueChip from 'root/src/client/logic/header/handlers/getValueChip'
import withModuleContext from 'root/src/client/util/withModuleContext'

const styles = {
	autoSelect: {
		width: 152,
		height: 29,
		marginLeft: 25,
		marginBottom: 12,
		boxShadow: '0 0 26px 0 rgba(0, 0, 0, 0.16)',
	},
}

const DropdownIndicator = props => (
	<components.DropdownIndicator {...props}>
		<SvgIcon>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
				<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
				<path d="M0 0h24v24H0z" fill="none" />
			</svg>
		</SvgIcon>
	</components.DropdownIndicator>
)

const singleStyle = {
	chip: {
		width: 100,
		height: 22,
		overflow: 'hidden',
		marginBottom: 2,
		display: 'flex',
		justifyContent: 'space-between',
		'& svg': {
			marginRight: 0,
		},
	},
	filter: {
		display: 'flex',
		flexDirection: 'column',
	},
}

const SingleValue = withStyles(singleStyle)(({ classes, children, label, removeProps, clearValue, getValue, ...props }) => (
	<components.SingleValue {...props}>
		<Chip
			className={classes.chip}
			tabIndex={-1}
			label={getValueChip(getValue())}
			onDelete={clearValue}
			deleteIcon={(
				<Tappable onTap={clearValue}>
					<CancelIcon {...removeProps} />
				</Tappable>
			)}
		/>
	</components.SingleValue>
))

export const AutoCompleteEmbedded = memo(({
	classes, fieldsLoadOptionsPromise, moduleKey, fieldPath, setInput, fieldsPlaceholder,
	endpointId, fieldValue, fieldIndex, fieldId, moduleId,
}) => (
	<AsyncSelect
		cacheOptions
		loadOptions={fieldsLoadOptionsPromise[fieldIndex]}
		defaultOptions
		value={fieldValue(fieldIndex, fieldId)}
		placeholder={fieldsPlaceholder[fieldIndex]}
		backspaceRemovesValue
		styles={{
			control: () => ({
				border: 'none',
				width: 125,
			}),
			dropdownIndicator: () => ({
				position: 'absolute',
				top: 7,
				right: 0,
			}),
			menu: () => ({
				position: 'absolute',
				zIndex: 1000,
				background: 'white',
				marginTop: -16,
				width: 152,
				boxShadow: '0 9px 13px 0 rgba(0, 0, 0, 0.26)',
			}),
			option: () => ({
				width: 142,
				height: 40,
				fontSize: 16,
				overflow: 'hidden',
				paddingLeft: 10,
				paddingTop: 6,
				fontWeight: 'normal',
				fontStyle: 'normal',
				lineHeight: 1.19,
				textAlign: 'left',
				color: '#000000',
				'&:hover': {
					background: '#eeeeee',
					cursor: 'pointer',
				},
			}),
			placeholder: (provided, state) => ({
				marginLeft: 5,
				display: state.isFocused ? 'none' : 'flex',
				color: '#cccccc',
				height: 24,
				alignItems: 'center',
			}),
		}}
		className={classes.autoSelect}
		onChange={value => setInput(moduleId, fieldPath(fieldId), value, endpointId[fieldIndex])}
		getOptionLabel={option => option.label}
		getOptionValue={option => option.value}
		components={{
			DropdownIndicator,
			SingleValue,
		}}
	/>
))

export default withStyles(styles)(AutoCompleteEmbedded)
