import { ADD_PAYOUT_METHOD_ON_SUCCESS } from 'root/src/client/logic/payoutMethod/actionIds'
import createPayoutMethodStoreKey from 'root/src/client/logic/payoutMethod/util/createPayoutMethodStoreId'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setPayoutMethodChild } = apiStoreLenses

export default {
	[ADD_PAYOUT_METHOD_ON_SUCCESS]: (state, { body }) => {
		const paramsRecordId = currentRouteParamsRecordId(state)
		const paymentMethodStoreKey = createPayoutMethodStoreKey(paramsRecordId)
		return setPayoutMethodChild(paymentMethodStoreKey, body, state)
	},
}
