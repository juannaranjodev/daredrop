import { toString, prop } from 'ramda'
import setFormErrors from 'root/src/client/logic/form/actions/setFormErrors'
import submitForm from 'root/src/client/logic/form/actions/submitForm'
import successPageSelector from 'root/src/client/logic/project/selectors/successPageSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

export default (data, actions, { moduleId, formSchema, formData, moduleKey }) => async (dispatch) => {
	actions.order.authorize().then((details) => {
		console.log('Authorize data below')
		console.log(details)
		const routeId = successPageSelector(moduleId)
		dispatch(pushRoute(routeId))
		return 'asdsadsad'
	}).catch(err => dispatch(setFormErrors(moduleKey, err)))
}
