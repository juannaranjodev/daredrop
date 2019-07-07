import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'

// eslint-disable-next-line max-len
export default ({ moduleKey }) => async (dispatch) => {
	try {
		console.warn({ pledgeAmount: 'Pledge amount must be at least $1.' })
		dispatch(submitForm(moduleKey))
		return true
	} catch (err) {
		console.warn(err)
		return dispatch(setFormErrors(moduleKey, err))
	}
}
