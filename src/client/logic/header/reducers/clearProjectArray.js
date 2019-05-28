import { startsWith, dissoc } from 'ramda'
import { CLEAR_PROJECT_ARRAY } from 'root/src/client/logic/header/actionsIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { viewRecords, setRecords, viewLists, setLists } = apiStoreLenses

export const clearProject = (state) => {
	const records = viewRecords(state)
	const list = viewLists(state)
	let newRecords = records
	Object.keys(records).forEach((record) => {
		if (startsWith('project-project', record)) {
			newRecords = dissoc(record, newRecords)
		}
	})

	const newRecordsState = setRecords(newRecords, state)

	let newList = list
	Object.keys(list).forEach((item) => {
		if (startsWith('GET_ACTIVE_PROJECTS', item)) {
			newList = dissoc(item, newList)
		}
	})

	return setLists(newList, newRecordsState)
}

export default {
	[CLEAR_PROJECT_ARRAY]: clearProject,
}
