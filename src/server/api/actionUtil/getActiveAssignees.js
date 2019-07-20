import { filter, anyPass, propEq } from 'ramda'
import { streamerPendingKey, streamerAcceptedKey } from 'root/src/shared/descriptions/apiLenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	const isPending = acceptedPropEq(streamerPendingKey)
	return filter(anyPass([isAccepted, isPending]), assignees)
}
