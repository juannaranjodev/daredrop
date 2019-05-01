import { filter, anyPass, propEq } from 'ramda'
import { projectPendingKey, streamerAcceptedKey } from 'root/src/server/api/lenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	const isPending = acceptedPropEq(projectPendingKey)
	return filter(anyPass([isAccepted, isPending]), assignees)
}
