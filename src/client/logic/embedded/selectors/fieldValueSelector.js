import { embeddedStoreLenses } from 'root/src/client/logic/embedded/lenses'
import fieldsDefaultSelector from 'root/src/client/logic/embedded/selectors/fieldsDefaultSelector'
import { prop } from 'ramda'

const { viewFieldData } = embeddedStoreLenses

export default (state, { moduleId }) => (index, id) => {
	const data = prop(id, viewFieldData(moduleId, state))
	const defaultValue = fieldsDefaultSelector(state, { moduleId })[index]
	return data || defaultValue
}
