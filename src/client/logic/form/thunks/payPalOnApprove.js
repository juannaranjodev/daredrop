import { toString, prop, path } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'
import successPageSelector from 'root/src/client/logic/project/selectors/successPageSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'

export default (data, actions, { moduleId, formSchema, formData, moduleKey }) => async (dispatch, getState) => {
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
			...formData,
			projectId,
			paymentInfo,
		}
		const routeId = successPageSelector(moduleId)
		// const endpointId =
		// return dispatch(apiRequest(PLEDGE_PROJECT, apiPayload))
	}).catch(err => dispatch(setFormErrors(moduleKey, err)))
}
