import { pathOr } from 'ramda'

export default (state, props = {}) => {
	const userDataObj = (pathOr(undefined, ['api', 'userData'], state))
	if (!userDataObj) {
		return {}
	}
	return userDataObj
}
