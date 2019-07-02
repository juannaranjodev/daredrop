import { embededStoreLenses } from 'root/src/client/logic/embeded/lenses'

const { viewFieldData } = embededStoreLenses

export default (state, { moduleId }) => viewFieldData(moduleId, state)
