import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

const { viewCustomSubmits } = formModuleLenses

export default (state, { moduleId }) => viewCustomSubmits(moduleId, moduleDescriptions)
