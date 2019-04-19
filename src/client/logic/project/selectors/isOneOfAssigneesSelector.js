import { length, map, prop, intersection } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	return length(intersection(userDataDisplayNames, assigneesDisplayNames))
}
