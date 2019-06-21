import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'

// eslint-disable-next-line max-len
export default ({ moduleKey }) => async (dispatch) => {
	try {
		dispatch(submitForm(moduleKey))
		return true
	} catch (err) {
		return dispatch(setFormErrors(moduleKey, err))
	}
}
