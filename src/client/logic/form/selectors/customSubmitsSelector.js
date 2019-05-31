import {
	__, compose, map, addIndex,
} from 'ramda'

import { moduleIdProp } from 'root/src/client/logic/route/lenses'
import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

const { viewSubmits } = formModuleLenses

export default (state, props) => compose(
	addIndex(map)(({ customSubmit }, submitIndex) => [
		customSubmit,
		submitIndex,
	]),
	viewSubmits(__, moduleDescriptions),
	moduleIdProp,
)(props)
