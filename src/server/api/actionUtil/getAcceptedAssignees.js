import { filter, anyPass, propEq } from 'ramda'
import { streamerAcceptedKey } from 'root/src/shared/descriptions/apiLenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	return filter(anyPass([isAccepted]), assignees)
}
