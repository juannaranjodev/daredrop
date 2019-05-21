import reduxConnector from 'root/src/shared/util/reduxConnector'

import emailSelector from 'root/src/client/logic/payoutMethod/selectors/emailSelector'
import setInput from 'root/src/client/logic/form/thunks/setInput'

export default reduxConnector(
	[
		['email', emailSelector],
	],
	[['setInput', setInput]],
)
