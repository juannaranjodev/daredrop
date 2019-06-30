import { compose, identity, lensProp, map, set, __ } from 'ramda'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import { SET_DEFAULT_PAYMENT_METHOD_ON_SUCCESS } from 'root/src/client/logic/list/actionIds'
import createPaymentMethodStoreKey from 'root/src/client/logic/list/util/createPaymentMethodStoreId'

const { overPaymentMethodChild, viewPaymentMethod, setPaymentMethod } = apiStoreLenses

export default {
	[SET_DEFAULT_PAYMENT_METHOD_ON_SUCCESS]: (state, { paymentMethodId }) => {
		const paymentMethodStoreKey = createPaymentMethodStoreKey(paymentMethodId)
		const isDefault = lensProp('isDefault')
		const setDefault = set(isDefault)
		const overPaymentMethodProp = overPaymentMethodChild(__)
		const overPaymentMethodToDefault = overPaymentMethodProp(paymentMethodStoreKey, setDefault(true))

		const paymentMethods = viewPaymentMethod(state)
		const setDefaultToFalse = setDefault(false)
		const mapDefaultToFalse = map(setDefaultToFalse, paymentMethods)

		return compose(
			overPaymentMethodToDefault,
			identity,
			setPaymentMethod(mapDefaultToFalse),
		)(state)
	},
}
