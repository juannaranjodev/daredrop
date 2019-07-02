import { embededStoreLenses } from 'root/src/client/logic/embeded/lenses'
import fieldsDefaultSelector from 'root/src/client/logic/embeded/selectors/fieldsDefaultSelector'
import { prop } from 'ramda'

const { viewFieldData } = embededStoreLenses

export default (state, { moduleId }) => (index, id) => {
 const data = prop(id, viewFieldData(moduleId, state))
 const defaultValue = fieldsDefaultSelector(state, { moduleId })[index]
 return data || defaultValue
}
