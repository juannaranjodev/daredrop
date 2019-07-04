import { ADD_PAYMENT_METHOD_ON_SUCCESS } from 'root/src/client/logic/list/actionIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { setPaymentMethodChild } = apiStoreLenses

export default {
	[ADD_PAYMENT_METHOD_ON_SUCCESS]:
		(state, { body: { stripeCardId, ...rest } }) => setPaymentMethodChild(stripeCardId, { stripeCardId, ...rest }, state),
}
