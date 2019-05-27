import { prop, path, omit } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import successPageSelector from 'root/src/client/logic/form/selectors/submitSuccessPageSelector'
import endpointIdSelector from 'root/src/client/logic/form/selectors/submitEndpointIdSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { paypalAuthorize } from 'root/src/shared/constants/paymentTypes'

export default (data, actions, { moduleId, formData, moduleKey, submitIndex }) => async (dispatch, getState) => {
	actions.order.authorize().then(({ purchase_units }) => {
		const state = getState()
		const projectId = currentRouteParamsRecordId(state)
		const paymentAuthorization = path([0, 'payments', 'authorizations', 0], purchase_units)

		const paymentInfo = {
			orderID: data.orderID,
			paymentId: prop('id', paymentAuthorization),
			paymentType: paypalAuthorize,
			paymentAmount: prop('pledgeAmount', formData),
		}
		const apiPayload = {
			...omit(['stripeCardId'], formData),
			projectId,
			paymentInfo,
		}
		const successPage = successPageSelector(moduleId, submitIndex)
		const endpointId = endpointIdSelector(moduleId, submitIndex)

		dispatch(apiRequest(endpointId, apiPayload)).then((res) => {
			console.log(res)
			return dispatch(pushRoute(successPage))
		}).catch(err => dispatch(setFormErrors(moduleKey, err)))
	}).catch(err => dispatch(setFormErrors(moduleKey, err)))
}
