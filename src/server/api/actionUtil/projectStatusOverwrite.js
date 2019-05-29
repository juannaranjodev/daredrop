import { projectStatusWeights } from 'root/src/server/api/lenses'
import { gt, lt } from 'ramda'

export default (projectStatus, projectStatusToOverwrite) => {
	if (gt(projectStatusWeights[projectStatus], projectStatusWeights[projectStatusToOverwrite])) {
		return projectStatus
	} if (lt(projectStatusWeights[projectStatus], projectStatusWeights[projectStatusToOverwrite])) {
		return projectStatusToOverwrite
	}
	return projectStatus
}
