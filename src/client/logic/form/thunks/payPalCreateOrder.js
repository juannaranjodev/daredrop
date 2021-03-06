import { toString, prop } from 'ramda'
import customValidateForm from 'root/src/client/logic/form/util/customValidateForm'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitFormError from 'root/src/client/logic/form/actions/submitFormError'
import clearButtonErrors from 'root/src/client/logic/form/actions/clearButtonErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'

// eslint-disable-next-line max-len
export default (data, actions, { moduleId, formSchema, formData, moduleKey }) => async (dispatch) => {
	try {
		// clear form
		dispatch(submitFormError(moduleKey, '', {}))
		dispatch(submitForm(moduleKey))
		dispatch(clearButtonErrors(moduleKey))
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
		return dispatch(setButtonErrors(moduleKey, err))
	}
}
