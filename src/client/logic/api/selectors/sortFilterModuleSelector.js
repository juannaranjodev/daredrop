import { listModuleLenses } from 'root/src/client/logic/list/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

const { viewSortFilterModule } = listModuleLenses

export default moduleId => viewSortFilterModule(moduleId, moduleDescriptions)