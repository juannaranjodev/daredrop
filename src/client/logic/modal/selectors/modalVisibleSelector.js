
import { path } from 'ramda'
import moduleDescriptionsObj from 'root/src/shared/descriptions/modules'

 export default (state, { moduleId }) => {
	const modalId = path([moduleId, 'moduleId'], moduleDescriptionsObj)
	return path(
		['app', modalId, 'modalVisible'], state,
	)
}