import {
	__, compose, map, addIndex,
} from 'ramda'

import { moduleIdProp } from 'root/src/client/logic/route/lenses'
import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

const { viewHandlers } = formModuleLenses

export default (state, props) => {
	const isNotNull = compose(viewHandlers(__, moduleDescriptions), moduleIdProp)(props)
	if (isNotNull) {
		return compose(
			addIndex(map)(({ label, buttonType }, handlerIndex) => [
				label,
				handlerIndex,
				buttonType,
			]),
			viewHandlers(__, moduleDescriptions),
			moduleIdProp,
		)(props)
	}
}
