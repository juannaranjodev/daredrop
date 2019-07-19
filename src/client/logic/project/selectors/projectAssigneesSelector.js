import { filter, prop, not, equals } from 'ramda'
import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'

import { projectStreamerRejectedKey } from 'root/src/shared/descriptions/apiLenses'

const responseLenses = getResponseLenses(GET_PROJECT)
const { pathOrAssignees } = responseLenses

export default (state, props) => {
	const assignneDidNotRejected = assignee => not(equals(prop('accepted', assignee), projectStreamerRejectedKey))
	return filter(assignneDidNotRejected, pathOrAssignees(
		[], getRecordSelector(state, props),
	))
}
