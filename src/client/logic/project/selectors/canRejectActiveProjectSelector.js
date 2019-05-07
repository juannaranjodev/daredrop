import { and, equals, or } from 'ramda'

import { projectApprovedKey, projectAcceptedKey } from 'root/src/server/api/lenses'
import statusSelector from 'root/src/client/logic/project/selectors/statusSelector'
import isAdminSelector from 'root/src/client/logic/auth/selectors/isAdminSelector'

export default (state, props) => and(or(
	equals(statusSelector(state, props), projectApprovedKey),
	equals(statusSelector(state, props), projectAcceptedKey),
),
isAdminSelector(state, props))
