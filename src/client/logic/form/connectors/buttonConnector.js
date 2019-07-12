import reduxConnector from 'root/src/shared/util/reduxConnector'

import buttonErrorTipSelector from 'root/src/client/logic/form/selectors/buttonErrorTipSelector'

export default reduxConnector(
	[
		['buttonErrorTip', buttonErrorTipSelector],
	],
)
