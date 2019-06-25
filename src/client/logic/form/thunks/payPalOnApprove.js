import { prop, path, omit } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import successPageSelector from 'root/src/client/logic/form/selectors/submitSuccessPageSelector'
import endpointIdSelector from 'root/src/client/logic/form/selectors/submitEndpointIdSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import currentRouteParamsRecordId from 'root/src/client/logic/route/selectors/currentRouteParamsRecordId'
import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'
import { paypalAuthorize } from 'root/src/shared/constants/paymentTypes'
import userIdFromPartialEntries from 'root/src/client/logic/form/selectors/userIdFromPartialEntries'
import { formStoreLenses } from 'root/src/client/logic/form/lenses'
import clearPartialFormKeys from 'root/src/client/logic/form/actions/clearPartialFormKeys'
import invokeApiLambda from 'root/src/client/logic/api/util/invokeApiLambda'
import { CLEAR_PARTIAL_FORM_KEYS } from 'root/src/shared/descriptions/endpoints/endpointIds'

const { viewFormChild } = formStoreLenses

export default (data, actions, { moduleId, formData, moduleKey, submitIndex }) => async (dispatch, getState) => {
	actions.order.authorize().then(async ({purchase_units}) => {
		const state = getState()
		const partialFormEntries = viewFormChild(`db-${moduleKey}`, state)
		if (partialFormEntries) {
			const partialKeys = Object.keys(partialFormEntries)
			const userId = userIdFromPartialEntries(partialFormEntries)

			await invokeApiLambda(
				CLEAR_PARTIAL_FORM_KEYS,
				{ userId, partialKeys },
				state,
			)
			dispatch(clearPartialFormKeys(moduleKey))
		}

		const projectId = currentRouteParamsRecordId(state)
		const paymentAuthorization = path([0, 'payments', 'authorizations', 0], purchase_units)

		const paymentInfo = {
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
		dispatch(apiRequest(endpointId, apiPayload)).then(() => dispatch(pushRoute(successPage))).catch(err => dispatch(setFormErrors(moduleKey, err)))
	}).catch(err => dispatch(setFormErrors(moduleKey, err)))
}
