import changeInput from 'root/src/client/logic/form/actions/changeInput'

import clearFormErrors from 'root/src/client/logic/form/actions/clearFormErrors'
import clearButtonErrors from 'root/src/client/logic/form/actions/clearButtonErrors'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'

import validateForm from 'root/src/client/logic/form/util/validateForm'

export const setInputHof = (
	validateFormFn, changeInputFn, clearFormErrorsFn, setFormErrorsFn, clearButtonErrorsFn,
) => (moduleKey, fieldPath, value) => (dispatch, getState) => {
	dispatch(changeInputFn(moduleKey, fieldPath, value))
	dispatch(clearButtonErrorsFn(moduleKey))
	const state = getState()
	return validateFormFn(moduleKey, state).then(() => {
		dispatch(clearFormErrorsFn(moduleKey))
	}).catch((errors) => {
		dispatch(setFormErrorsFn(moduleKey, errors))
	})
}

export default setInputHof(
	validateForm, changeInput, clearFormErrors, setFormErrors, clearButtonErrors,
)
