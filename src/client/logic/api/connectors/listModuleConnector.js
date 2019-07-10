import reduxConnector from 'root/src/shared/util/reduxConnector'

import getListSelector from 'root/src/client/logic/api/selectors/getListSelector'
import listTypeSelector from 'root/src/client/logic/list/selectors/listTypeSelector'
import listTitleSelector from 'root/src/client/logic/list/selectors/listTitleSelector'
import listSubtitleSelector from 'root/src/client/logic/list/selectors/listSubtitleSelector'
import listControlsSelector from 'root/src/client/logic/list/selectors/listControlsSelector'
import visibleLoadingBlockSelector from 'root/src/client/logic/list/selectors/visibleLoadingBlockSelector'

import deletePaymentMethod from 'root/src/client/logic/list/thunks/deletePaymentMethod'
import setDefaultPaymentMethod from 'root/src/client/logic/list/thunks/setDefaultPaymentMethod'

import currentPageSelector from 'root/src/client/logic/list/selectors/currentPageSelector'
import hasMoreSelector from 'root/src/client/logic/list/selectors/hasMoreSelector'
import getNextPage from 'root/src/client/logic/list/thunks/getNextPage'

export default reduxConnector(
	[
		['list', getListSelector],
		['listType', listTypeSelector],
		['listTitle', listTitleSelector],
		['listSubtitle', listSubtitleSelector],
		['listControls', listControlsSelector],
		['currentPage', currentPageSelector],
		['hasMore', hasMoreSelector],
		['visibleLoadingBlock', visibleLoadingBlockSelector],
	],
	[
		['deletePaymentMethod', deletePaymentMethod],
		['setDefaultPaymentMethod', setDefaultPaymentMethod],
		['getNextPage', getNextPage],
	],
)
