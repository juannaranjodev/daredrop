import { filter, anyPass, propEq } from 'ramda'
import { streamerPendingKey, streamerAcceptedKey } from 'root/src/server/api/lenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	const isPending = acceptedPropEq(streamerPendingKey)
	return filter(anyPass([isAccepted, isPending]), assignees)
}
