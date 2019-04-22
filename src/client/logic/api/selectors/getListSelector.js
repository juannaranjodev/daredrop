import { contains, filter, reduce, map, isNil } from 'ramda'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'

const { viewItems, viewListProcessing } = apiStoreLenses

export default (state, { moduleId }) => {
	const endpointId = moduleEndpointIdSelector(state, { moduleId })
	const listProcessing = Object.keys(viewListProcessing(state) || [])
	let moduleProcess
	if (typeof endpointId === 'string') {
		moduleProcess = filter(process => contains(endpointId, process), listProcessing)
	} else {
		moduleProcess = reduce(
			(acc, endpoint) => acc.concat(filter(process => contains(endpoint, process), listProcessing)),
			[],
			endpointId,
		)
	}

	const list = map((item) => {
		const result = viewItems(item, state)
		return !isNil(result) ? result : []
	}, moduleProcess)

	return list
}
