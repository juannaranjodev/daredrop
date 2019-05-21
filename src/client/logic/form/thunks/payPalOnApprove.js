import { toString, prop } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'
import successPageSelector from 'root/src/client/logic/project/selectors/successPageSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

export default (data, actions, { moduleId, formSchema, formData, moduleKey }) => async (dispatch) => {
	try {
		actions.order.authorize().then((details) => {
			console.log('Authorize data below')
			console.log(details)
			const successPage = successPageSelector(moduleId)
			dispatch(pushRoute(successPage))
		})
	} catch (err) {
		dispatch(setFormErrors(moduleKey, err))
	}
}
