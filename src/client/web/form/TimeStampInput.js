import React, { memo, useState } from 'react'

import withModuleContext from 'root/src/client/util/withModuleContext'
import fieldInputConnector from 'root/src/client/logic/form/connectors/fieldInputConnector'
import TextField from '@material-ui/core/TextField'

const styles = {
	timeStamp: {
		display: 'flex',
		flexDirection: 'column',
	},
	field: {
		width: 47,
		paddingTop: 4,
	},
	fieldContainer: {
		paddingRight: 10,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		'& label': {
			textAlign: 'center',
		},
	},
	inputWrapper: {
		display: 'flex',
		flexDirection: 'row',
	},
	errors: {
		marginTop: 4,
		color: 'red',
		fontSize: 13,
	},
}

const TimeStapmInputUnconnected = memo(({
	moduleKey, fieldId, fieldPath, setInput, fieldLabel, fieldError,
	fieldHasError, classes,
}) => {
	const [value, setValue] = useState('::')
	const [currentInput, setCurrentInput] = useState('00:00:00')

	const onChange = (e) => {
		const dateObject = {
			hour: 0,
			minute: 1,
			second: 2,
		}
		const type = dateObject[e.target.name]
		const valueArr = value.split(':')
		const inputArr = currentInput.split(':')
		const result = `0${e.target.value}`.slice(-2)
		valueArr[type] = result
		inputArr[type] = result
		setValue(valueArr.join(':'))
		setCurrentInput(inputArr.join(':'))
		setInput(moduleKey, fieldPath, inputArr.join(':'))
	}

	return (
		<div className={classes.timeStamp}>
			<div className={classes.inputWrapper}>
				<div className={classes.fieldContainer}>
					<label htmlFor="hour">Hr</label>
					<TextField
						id={fieldId}
						label={fieldLabel}
						type="text"
						name="hour"
						variant="outlined"
						value={value.split(':')[0]}
						placeholder="00"
						error={fieldHasError}
						className={classes.field}
						onChange={onChange}
					/>
				</div>
				<div className={classes.fieldContainer}>
					<label htmlFor="minute">Min</label>
					<TextField
						id={fieldId}
						label={fieldLabel}
						type="text"
						name="minute"
						variant="outlined"
						value={value.split(':')[1]}
						placeholder="00"
						error={fieldHasError}
						className={classes.field}
						onChange={onChange}
					/>
				</div>
				<div className={classes.fieldContainer}>
					<label htmlFor="second">Sec</label>
					<TextField
						id={fieldId}
						label={fieldLabel}
						type="text"
						name="second"
						variant="outlined"
						value={value.split(':')[2]}
						placeholder="00"
						error={fieldHasError}
						className={classes.field}
						onChange={onChange}
					/>
				</div>
			</div>
			{ fieldHasError
			&& (
				<div className={classes.errors}>
					{fieldError}
				</div>
			)
			}
		</div>
	)
})


export default withModuleContext(
	fieldInputConnector(TimeStapmInputUnconnected, styles),
)
