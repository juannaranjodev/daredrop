import { filter, anyPass, propEq } from 'ramda'
import { streamerAcceptedKey } from 'root/src/server/api/lenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	return filter(anyPass([isAccepted]), assignees)
}
