import { startsWith, reduce, filter, anyPass } from 'ramda'
import { CLEAR_PROJECT_ARRAY } from 'root/src/client/logic/header/actionsIds'
import { apiStoreLenses } from 'root/src/client/logic/api/lenses'

const { dissocPathProject, viewLists, dissocPathListsChild } = apiStoreLenses

export const clearProject = (state) => {
	const list = viewLists(state)
	const listKeys = Object.keys(list)

	const activeProjectsFilter = startsWith('GET_ACTIVE_PROJECTS')
	const myProjectsFilter = startsWith('GET_MY_PROJECTS')
	const listKeysToDissoc = filter(anyPass([activeProjectsFilter, myProjectsFilter]), listKeys)

	const listsDissoc = reduce((acc, item) => dissocPathListsChild(item, acc),
		state, listKeysToDissoc)

	return dissocPathProject(listsDissoc)
}

export default {
	[CLEAR_PROJECT_ARRAY]: clearProject,
}
