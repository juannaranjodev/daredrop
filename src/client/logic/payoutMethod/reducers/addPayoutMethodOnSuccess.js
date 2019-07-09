import { ADD_PAYOUT_METHOD_ON_SUCCESS } from 'root/src/client/logic/payoutMethod/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setPayoutMethod } = apiStoreLenses

export default {
	[ADD_PAYOUT_METHOD_ON_SUCCESS]: (state, { body }) => setPayoutMethod(body, state),
}
