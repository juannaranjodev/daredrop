import React, { memo, useState } from 'react'
import withModuleContext from 'root/src/client/util/withModuleContext'
import fieldInputConnector from 'root/src/client/logic/form/connectors/fieldInputConnector'
import { primaryColor } from 'root/src/client/web/commonStyles'
import Attachment from '@material-ui/icons/Attachment'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from 'root/src/client/web/base/Button'

const styles = {
	icon: {
		marginTop: 10,
		transform: 'rotate(-45deg)',
		cursor: 'pointer',
	},
	input: {
		width: 0.1,
		height: 0.1,
		opacity: 0,
		overflow: 'hidden',
		position: 'absolute',
		zIndex: -1,
	},
	iconWrap: {
		display: 'flex',
	},
	fileChose: {
		marginTop: 8,
		color: primaryColor,
	},
	dialogContent: {
		width: 400,
	},
	okButton: {
		width: 40,
		marginRight: 20,
	},
	attachmentWrap: {
		marginTop: 10,
		marginBottom: -3,
	},
}

export const AtachmentInputUnconected = memo(({
	moduleKey, fieldPath, setInput, classes,
}) => {
	const [file, setFile] = useState({})
	const [open, setOpen] = useState(false)

	const onChange = async (e) => {
		const currentFile = e.target.files[0]
		const value = {
			name: currentFile.name,
		}
		const arrFormat = ['mp4', 'mov', 'mpeg4', 'avi', 'wmv', 'mpegps', 'flv', 'webm', '3gp', '3gpp', 'mxf']
		const arr = value.name.split('.')
		const formatFile = arr[arr.length - 1]

		if (arrFormat.includes(formatFile)) {
			const reader = new FileReader()

			reader.onload = (theFile => (event) => {
				const result = { data: event.target.result, name: theFile.name }
				setInput(moduleKey, fieldPath, result)
				setFile(currentFile)
			})(currentFile)

			reader.readAsDataURL(currentFile)
			setInput(moduleKey, fieldPath, value)
		} else {
			setOpen(true)
			setFile({})
		}
	}
	return (
		<div className={classes.attachmentWrap}>
			<label htmlFor="file" className={classes.iconWrap}>
				<Attachment className={classes.icon} fontSize="large" />
				<div className={classes.fileChose}>
					{file.name}
				</div>
			</label>
			<input type="file" id="file" name="file" className={classes.input} onChange={onChange} />
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="xs"
				fullWidth
				aria-labelledby="max-width-dialog-title"
			>
				<DialogTitle id="max-width-dialog-title">Error</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Only video formats
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} color="primary" style={classes.okButton} autoFocus>
						Ok
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
})

export default withModuleContext(
	fieldInputConnector(AtachmentInputUnconected, styles),
)
