import reduxConnector from 'root/src/shared/util/reduxConnector'

import isShowMessageSelector from 'root/src/client/logic/app/selectors/isShowMessageSelector'
import getPositionSelector from 'root/src/client/logic/app/selectors/getPositionSelector'
import getMessageTextSelector from 'root/src/client/logic/app/selectors/getMessageTextSelector'

export default reduxConnector(
	[
		['isShow', isShowMessageSelector],
		['position', getPositionSelector],
		['text', getMessageTextSelector],
	],
	[

	],
)
