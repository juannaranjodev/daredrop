import { embeddedStoreLenses } from 'root/src/client/logic/embedded/lenses'

const { viewFieldData } = embeddedStoreLenses

export default (state, { moduleId }) => viewFieldData(moduleId, state)
