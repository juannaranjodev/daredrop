import projectAssigneesSelector from 'root/src/client/logic/project/selectors/projectAssigneesSelector'
import getUserDataSelector from 'root/src/client/logic/api/selectors/getUserDataSelector'

export default (state, props) => {
	const assignees = projectAssigneesSelector(state, props)
	const userData = getUserDataSelector(state, props)

	return assignees
		.filter(assignee => assignee.username === userData.displayName).length > 0
}
