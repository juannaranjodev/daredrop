import { compose } from 'ramda'

import { API_RECORD_REQUEST_SUCCESS } from 'root/src/client/logic/api/actionIds'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import { apiStoreLenses, idProp } from 'root/src/client/logic/api/lenses'
import getLensFromType from 'root/src/client/logic/api/util/getLensFromType'

const { setRecordProcessingChild } = apiStoreLenses

export const apiRecordRequestSuccess = (
	state,
	{ recordType, record },
) => {
	const recordId = idProp(record)
	const recordStoreId = createRecordStoreKey(recordType, recordId)
	const setRecordsChild = getLensFromType('set', 'child', recordType, apiStoreLenses)

	return compose(
		setRecordsChild(recordStoreId, record),
		setRecordProcessingChild(recordStoreId, false),
	)(state)
}

export default {
	[API_RECORD_REQUEST_SUCCESS]: apiRecordRequestSuccess,
}
