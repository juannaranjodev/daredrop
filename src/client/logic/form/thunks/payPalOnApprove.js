import { toString, prop, path, omit } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'
import successPageSelector from 'root/src/client/logic/form/selectors/submitSuccessPageSelector'
import endpointIdSelector from 'root/src/client/logic/form/selectors/submitEndpointIdSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'

export default (data, actions, { moduleId, formSchema, formData, moduleKey, submitIndex }) => async (dispatch, getState) => {
	actions.order.authorize().then(({ create_time, id, payer, purchase_units }) => {
		const state = getState()
		const projectId = currentRouteParamsRecordId(state)
		const created = create_time
		const email = prop('email_address', payer)
		const name = `${path(['name', 'given_name'], payer)} ${path(['name', 'surname'], payer)}`
		const paymentAuthorization = path([0, 'payments', 'authorizations', 0], purchase_units)
		const paymentInfo = {
			created,
			email,
			name,
			paymentAuthorization,
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
		})
	}).catch(err => dispatch(setFormErrors(moduleKey, err)))
}
