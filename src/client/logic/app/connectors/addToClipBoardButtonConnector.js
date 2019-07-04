import reduxConnector from 'root/src/shared/util/reduxConnector'

import addToClipBoard from 'root/src/client/logic/app/thunks/addToClipBoard'

export default reduxConnector(
	[],
	[
		['addToClipboard', addToClipBoard],
	],
)
