import React, { memo } from 'react'
import addToClipBoardButtonConnector from 'root/src/client/logic/app/connectors/addToClipBoardButtonConnector'

const style = {}

const AddToClipboard = memo(({ url, addToClipboard, children }) => {
	const onClickHendler = (e) => {
		addToClipboard(url, e)
	}
	return (
		<div>
			<div onClick={onClickHendler}>{children}</div>
		</div>
	)
})

export default addToClipBoardButtonConnector(AddToClipboard, style)
