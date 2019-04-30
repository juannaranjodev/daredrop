import { intersection, prop, map } from 'ramda'

export default (tokensArr, projectToAccept) => {
	const projectAssignees = prop('assignees', projectToAccept)
	const makeToken = assignee => `token-${prop('platform', assignee)}|${prop('platformId', assignee)}`
	const projectTokens = map(makeToken, projectAssignees)
	const userToken = map(prop('sk'), tokensArr)
	return intersection(projectTokens, userToken)
}
