import { contains, filter, reduce, map, isNil } from 'ramda'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import moduleEndpointIdSelector from 'root/src/client/logic/api/selectors/moduleEndpointIdSelector'

const { viewItems, viewListProcessing } = apiStoreLenses

export default (state, { moduleId }) => {
	const endpointId = moduleEndpointIdSelector(state, { moduleId })
	const listProcessing = Object.keys(viewListProcessing(state) || [])
	let moduleProcess
	let list = []
	if (typeof endpointId === 'string') {
		moduleProcess = filter(process => contains(endpointId, process), listProcessing)
		list = viewItems(moduleProcess[0], state)
	} else {
		moduleProcess = reduce(
			(acc, endpoint) => acc.concat(filter(process => contains(endpoint, process), listProcessing)),
			[],
			endpointId,
		)

		list = map((item) => {
			const result = viewItems(item, state)
			return !isNil(result) ? result : []
		}, moduleProcess)
		const filterArr = list.slice(list.length - (endpointId.length - 1), list.length)
		list = list.slice(0, list.length - (endpointId.length - 1))
		list = reduce((acc, item) => acc.concat(item), [], list)
		list = [list, ...filterArr]
	}

	return list
}
