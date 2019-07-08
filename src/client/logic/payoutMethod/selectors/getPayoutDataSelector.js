import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'

import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewPayoutMethodChild } = apiStoreLenses

export default (state, recordType) => {
	const paramsRecordId = currentRouteParamsRecordId(state)
	const recordStoreId = createRecordStoreKey(recordType, paramsRecordId)
	return viewPayoutMethodChild(recordStoreId, state)
}
