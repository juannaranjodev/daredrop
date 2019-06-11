import { startsWith, reduce, assoc } from 'ramda'
import { CLEAR_PROJECT_ARRAY } from 'root/src/client/logic/header/actionsIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewRecords, setRecords, viewLists, setLists } = apiStoreLenses

export const clearProject = (state) => {
	const records = viewRecords(state)
	const list = viewLists(state)
	const newRecords = reduce((accum, record) => {
		if (!startsWith('project-project', record)) {
			assoc(record, records[record], accum)
		}
		return accum
	}, {}, Object.keys(records))

	const newRecordsState = setRecords(newRecords, state)

	const newList = reduce((accum, item) => {
		if (!startsWith('GET_ACTIVE_PROJECTS', item)) {
			assoc(item, list[item], accum)
		}
		return accum
	}, {}, Object.keys(list))

	return setLists(newList, newRecordsState)
}

export default {
	[CLEAR_PROJECT_ARRAY]: clearProject,
}
