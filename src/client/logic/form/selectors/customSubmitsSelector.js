import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'
import { compose, __, addIndex, map } from 'ramda'
import { moduleIdProp } from 'root/src/client/logic/route/lenses'

const { viewCustomSubmits } = formModuleLenses

export default (state, props) => compose(
	addIndex(map)(({ Submit, specificSubmitProps }, submitIndex) => [
		Submit,
		specificSubmitProps,
		submitIndex,
	]),
	viewCustomSubmits(__, moduleDescriptions),
	moduleIdProp,
)(props)
