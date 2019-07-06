/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
import React, { memo } from 'react'
import Select from 'react-select'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	autoSelect: {
		width: 152,
		height: 29,
		marginLeft: 25,
		marginBottom: 12,
		boxShadow: '0 0 26px 0 rgba(0, 0, 0, 0.16)',
	},
	sort: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
	},
}

const DropdownEmbedded = memo(({
	setInput, classes, fieldPath, endpointId, fieldIndex, fieldValue, fieldsOptions, fieldId, moduleId,
}) => (
		<div className={classes.sort}>
			<Select
				value={fieldValue(fieldIndex, fieldId)}
				onChange={value => setInput(moduleId, fieldPath(fieldId), value, endpointId[fieldIndex])}
				className={classes.autoSelect}
				options={fieldsOptions[fieldIndex]}
				styles={{
					control: () => ({
						width: 152,
						height: 29,
						border: 'none',
					}),
					dropdownIndicator: (provided, state) => {
						const rotate = state.isFocused ? '180' : '0'
						return {
							position: 'absolute',
							top: !state.isFocused ? 5 : 2,
							right: 4,
							fontWeight: 400,
							transform: `rotate(${rotate}deg)`,
						}
					},
					menu: () => ({
						position: 'absolute',
						zIndex: 1000,
						background: 'white',
						width: 152,
						boxShadow: '0 9px 13px 0 rgba(0, 0, 0, 0.26)',
					}),
					option: () => ({
						width: 123,
						height: 26,
						fontSize: 16,
						paddingLeft: 19,
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
					singleValue: () => ({
						paddingBottom: 3,
						paddingLeft: 10,
						fontWeight: 'normal',
						fontStyle: 'normal',
						color: '#000000',
						zIndex: 1000,
					}),
				}}
			/>
		</div>
	))

export default withStyles(styles)(DropdownEmbedded)
