import { filter, anyPass, propEq } from 'ramda'
import { streamerPendingKey, streamerAcceptedKey, streamerDeliveryApprovedKey } from 'root/src/shared/descriptions/apiLenses'

export default (assignees) => {
	const acceptedPropEq = propEq('accepted')
	const isAccepted = acceptedPropEq(streamerAcceptedKey)
	const isPending = acceptedPropEq(streamerPendingKey)
	const isDeliveryApproved = acceptedPropEq(streamerDeliveryApprovedKey)
	return filter(anyPass([isAccepted, isPending, isDeliveryApproved]), assignees)
}
