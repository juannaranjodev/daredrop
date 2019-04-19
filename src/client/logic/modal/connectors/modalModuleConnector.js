
import reduxConnector from 'root/src/shared/util/reduxConnector'

import modalTypeSelector from 'root/src/client/logic/modal/selectors/modalTypeSelector'
import modalTitleSelector from 'root/src/client/logic/modal/selectors/modalTitleSelector'
import modalTextSelector from 'root/src/client/logic/modal/selectors/modalTextSelector'
import modalVisibleSelector from 'root/src/client/logic/modal/selectors/modalVisibleSelector'
import moduleIdSelector from 'root/src/client/logic/modal/selectors/moduleIdSelector'
import displayModal from 'root/src/client/logic/modal/thunks/displayModal'
import rejectProject from 'root/src/client/logic/project/thunks/rejectProject'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

 export default reduxConnector(
	[
		['modalType', modalTypeSelector],
		['modalTitle', modalTitleSelector],
		['modalText', modalTextSelector],
		['modalVisible', modalVisibleSelector],
		['moduleId', moduleIdSelector],
	],
	[
		['displayModal', displayModal],
		['rejectProject', rejectProject],
		['pushRoute', pushRoute],
	],
)