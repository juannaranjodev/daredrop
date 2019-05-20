import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'
import { compose, addIndex, map } from 'ramda'

const { viewCustomSubmits } = formModuleLenses

export default (state, { moduleId }) => compose(
	addIndex(map)(({ Submit }, submitIndex) => [
		Submit,
		submitIndex],
	viewCustomSubmits(moduleId, moduleDescriptions)),
)
