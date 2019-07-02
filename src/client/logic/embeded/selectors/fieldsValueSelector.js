import { embededStoreLenses } from 'root/src/client/logic/embeded/lenses'
import fieldsDefaultSelector from 'root/src/client/logic/embeded/selectors/fieldsDefaultSelector'

const { viewFieldData } = embededStoreLenses

export default (state, { moduleId }) => viewFieldData(moduleId, state) || fieldsDefaultSelector(state, { moduleId })
