import { reduce, append, compose, or, isNil } from 'ramda'
import { ternary } from 'root/src/shared/util/ramdaPlus'
import { API_LIST_REQUEST_SUCCESS } from 'root/src/client/logic/api/actionIds'
import createRecordStoreKey from 'root/src/client/logic/api/util/createRecordStoreKey'
import {
	apiStoreLenses, nextKeyProp, idProp, itemsProp, projectIdProp,
} from 'root/src/client/logic/api/lenses'
import getLensFromType from 'root/src/client/logic/api/util/getLensFromType'

const { setNext, setItems, setListProcessingChild } = apiStoreLenses

export const apiListRequestSuccess = (
	state,
	{ listStoreKey, recordType, list },
) => {
	let listIds = []
	const listItems = itemsProp(list)
	const recordsSet = reduce((result, record) => {
		const recordId = or(idProp(record), projectIdProp(record))
		const recordStoreId = createRecordStoreKey(recordType, recordId)
		listIds = append(recordId, listIds)
		const viewRecordsChild = getLensFromType('view', 'child', recordType, apiStoreLenses)
		const setRecordsChild = getLensFromType('set', 'child', recordType, apiStoreLenses)
		let lastRecord = viewRecordsChild(recordStoreId, result)
		lastRecord = ternary(isNil(lastRecord), {}, lastRecord)
		return setRecordsChild(recordStoreId, { ...lastRecord, ...record }, result)
	}, state, listItems)
	return compose(
		setNext(listStoreKey, nextKeyProp(list)),
		setItems(listStoreKey, listIds),
		setListProcessingChild(listStoreKey, false),
	)(recordsSet)
}

export default {
	[API_LIST_REQUEST_SUCCESS]: apiListRequestSuccess,
}
