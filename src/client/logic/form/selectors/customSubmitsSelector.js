import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'
import { compose, __, addIndex, map } from 'ramda'
import { moduleIdProp } from 'root/src/client/logic/route/lenses'

const { pathOrCustomSubmits } = formModuleLenses

export default (state, props) => compose(
	addIndex(map)(({ submit, specificSubmitProps }, submitIndex) => [
		submit,
		specificSubmitProps,
		submitIndex,
	]),
	pathOrCustomSubmits(__, [], moduleDescriptions),
	moduleIdProp,
)(props)
