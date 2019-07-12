import { and, equals, anyPass } from 'ramda'
import { projectApprovedKey, projectAcceptedKey, projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'
import statusSelector from 'root/src/client/logic/project/selectors/statusSelector'
import isAdminSelector from 'root/src/client/logic/auth/selectors/isAdminSelector'

export default (state, props) => and(
	anyPass([
		equals(statusSelector(state, props), projectApprovedKey),
		equals(statusSelector(state, props), projectAcceptedKey),
		equals(statusSelector(state, props), projectDeliveryPendingKey),
	]),
	isAdminSelector(state, props),
)
