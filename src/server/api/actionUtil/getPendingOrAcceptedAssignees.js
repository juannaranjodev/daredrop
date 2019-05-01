import { filter, anyPass, propEq } from 'ramda'
import { projectPendingKey, projectAcceptedKey } from 'root/src/server/api/lenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(projectAcceptedKey)
	const isPending = acceptedPropEq(projectPendingKey)
	return filter(anyPass([isAccepted, isPending]), assignees)
}
