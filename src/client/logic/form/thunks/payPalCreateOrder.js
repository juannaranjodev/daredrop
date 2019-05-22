import { toString, prop } from 'ramda'
import customValidateForm from 'root/src/client/logic/form/util/customValidateForm'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'

export default (data, actions, { moduleId, formSchema, formData, moduleKey }) => async (dispatch) => {
	try {
		dispatch(submitForm(moduleKey))
		await customValidateForm(moduleId, formSchema, formData)
		return actions.order.create({
			purchase_units: [{
				amount: {
					currency_code: 'USD',
					value: toString(prop('pledgeAmount', formData)),
				},
			}],
			application_context: {
				shipping_preference: 'NO_SHIPPING',
			},
		})
	} catch (err) {
		return dispatch(setFormErrors(moduleKey, err))
	}
}
