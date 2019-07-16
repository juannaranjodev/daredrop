import { prop, has } from 'ramda'
import { SUBMIT_FORM_ERROR } from 'root/src/client/logic/form/actionIds'

export default (moduleKey, submitIndex, error) => {
	let errorString = ''
	if (has('schemaErrors', error)) {
		const schemaError = prop('schemaErrors', error)
		if (prop('type', schemaError) === 'StripeInvalidRequestError') {
			errorString = 'Error: Your card was declined. Your request was in test mode, but used a non test (live) card. For a list of valid test cards, visit: https://stripe.com/docs/testing.'
		} else {
			errorString = prop('type', schemaError)
		}
	} else if (has('error', error)){
		errorString = prop('error', error)
	}
	return {
		type: SUBMIT_FORM_ERROR,
		payload: { moduleKey, submitIndex, error: errorString },	
	}
} 
