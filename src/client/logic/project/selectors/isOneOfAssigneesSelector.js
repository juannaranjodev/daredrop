import { length, map, prop, intersection } from 'ramda'
import objectToArray from 'root/src/client/logic/api/util/objectToArray'

export default (assignees, userData) => {
	const userDataDisplayNames = map(prop('displayName'), objectToArray(userData))
	const assigneesDisplayNames = map(prop('displayName'), assignees)
	return length(intersection(userDataDisplayNames, assigneesDisplayNames))
}
