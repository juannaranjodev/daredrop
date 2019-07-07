import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'
import recordTypeSelector from 'root/src/client/logic/api/selectors/recordTypeSelector'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'

import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import getLensFromType from 'root/src/client/logic/api/util/getLensFromType'

export default (state, props = {}) => {
	const { moduleId, recordId } = props
	const endpointId = moduleEndpointIdSelector(state, { moduleId })
	let recordType
	if (typeof endpointId === 'string') {
		recordType = recordTypeSelector(endpointId)
	} else {
		recordType = recordTypeSelector(endpointId[0])
	}

	const viewRecordsChild = getLensFromType('view', 'child', recordType, apiStoreLenses)
	// From a list module we just pass in the recordId, for a record view we
	// have to get it from the current route params
	let recordStoreId
	if (recordId) {
		recordStoreId = createRecordStoreKey(recordType, recordId)
		return viewRecordsChild(recordStoreId, state)
	}
	const paramsRecordId = currentRouteParamsRecordId(state)
	recordStoreId = createRecordStoreKey(recordType, paramsRecordId)
	return viewRecordsChild(recordStoreId, state)
}
