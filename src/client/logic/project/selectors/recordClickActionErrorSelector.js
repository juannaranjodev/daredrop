import { apiStoreLenses } from 'root/src/client/logic/api/lenses'
import modulesObj from 'root/src/shared/descriptions/modules'
import { map, __, pathOr, path, mergeAll } from 'ramda'
import createRecordClickActionStoreKey from 'root/src/client/logic/api/util/createRecordClickActionStoreKey'
import matchPath from 'root/src/client/logic/route/util/matchPath'
import { omitEmpty } from 'root/src/shared/util/ramdaPlus'

const { viewRecordClickActionErrorsChild } = apiStoreLenses

export default (state, { moduleId }) => {
	const recordClickActions = pathOr([], [moduleId, 'recordClickActions'], modulesObj)
	const { routeParams } = matchPath(window.location.pathname)
	const recordId = path(['recordId'], routeParams)
	const recordClickActionStoreKeys = map(recordClickActionId => createRecordClickActionStoreKey(
		recordClickActionId, recordId,
	), recordClickActions)
	return mergeAll(omitEmpty(map(viewRecordClickActionErrorsChild(__, state), recordClickActionStoreKeys)))
}
