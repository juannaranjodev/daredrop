import { prop, filter, compose, assoc } from 'ramda'

import { DELETE_PAYMENT_METHOD_ON_SUCCESS } from 'root/src/client/logic/list/actionIds'
import { GET_PAYMENT_METHODS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	apiStoreLenses,
} from 'root/src/client/logic/api/lenses'
import createPaymentMethodStoreKey from 'root/src/client/logic/list/util/createPaymentMethodStoreId'
import createListStoreKey from 'root/src/client/logic/api/util/createListStoreKey'

const { dissocPathPaymentMethodChild, viewListsChild, setListsChild } = apiStoreLenses

export default {
	[DELETE_PAYMENT_METHOD_ON_SUCCESS]: (state, { paymentMethodId }) => {
		const paymentMethodStoreKey = createPaymentMethodStoreKey(paymentMethodId)
		const listStoreKey = createListStoreKey(GET_PAYMENT_METHODS, { filter: undefined, sortType: undefined })
		const prevList = prop('items', viewListsChild(listStoreKey, state))
		const isNotDefaultFIlter = payment => payment !== paymentMethodId
		const newList = assoc('items', filter(isNotDefaultFIlter, prevList), {})

		return compose(
			dissocPathPaymentMethodChild(paymentMethodStoreKey),
			setListsChild(listStoreKey, newList),
		)(state)
	},
}
