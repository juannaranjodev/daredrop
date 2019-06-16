import { isNil, equals, max } from 'ramda'
import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import { projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'
import moment from 'moment-mini'
import { daysToExpire } from 'root/src/shared/constants/timeConstants'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewApproved } = responseLenses
const { viewStatus } = responseLenses

export default (state, props) => {
	const approved = viewApproved(
		getRecordSelector(state, props),
	)

	if (isNil(approved)) {
		return 0
	}
	const diff = moment().diff(approved, 'days')
	return max(Math.ceil(daysToExpire - diff), 0)
}
