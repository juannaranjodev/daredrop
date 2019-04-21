import { prop, filter, anyPass, propEq } from 'ramda'
import { projectPendingKey, projectAcceptedKey } from 'root/src/server/api/lenses'

export default (project) => {
	const assignees = prop('assignees', project)
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(projectAcceptedKey)
	const isPending = acceptedPropEq(projectPendingKey)
	return filter(anyPass([isAccepted, isPending]), assignees)
}
