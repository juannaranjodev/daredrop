/* eslint-disable no-unused-vars */
import submitFormError from 'root/src/client/logic/form/actions/submitFormError'
// eslint-disable-next-line max-len
export default (error, { moduleId, formData, moduleKey, submitIndex }) => async (dispatch, getState) => {
	dispatch(submitFormError(moduleKey, submitIndex, {error: 'PayPal failed to process payment'}))
}
