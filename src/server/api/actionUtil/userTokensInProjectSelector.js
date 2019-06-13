import { intersection, prop, map } from 'ramda'
import buildUserSortKeyFromAssigneeObj from 'root/src/server/api/actionUtil/buildUserSortKeyFromAssigneeObj'

export default (tokensArr, projectToAccept) => {
	const projectAssignees = prop('assignees', projectToAccept)
	const makeToken = assignee => `token-${buildUserSortKeyFromAssigneeObj(assignee)}`
	const projectTokens = map(makeToken, projectAssignees)
	const userToken = map(prop('sk'), tokensArr)
	return intersection(projectTokens, userToken)
}
