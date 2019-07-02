import reduxConnector from 'root/src/shared/util/reduxConnector'

import setInputAsync from 'root/src/client/logic/embeded/thunks/setInputAsync'

export default reduxConnector(
	[
		['fieldValue', fieldValueSelector],
	],
	[
		['setInput', setInputAsync],
	],
)
