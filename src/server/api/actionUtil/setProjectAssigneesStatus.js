import { assocPath, prop, propEq, findIndex, map, set, reduce, mergeAll, and } from 'ramda'

export default (userTokensObj, project, status) => {
	const assignees = prop('assignees', project)
	return reduce((proj, userTokenObj) => {
		const { platform, platformId } = userTokenObj
		const listedAssignee = findIndex(and(propEq('platform', platform), propEq('platformId', platformId)), assignees)
		return assocPath(['assignees', listedAssignee, 'accepted'], status, proj)
	}, project, userTokensObj)
}
