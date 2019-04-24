import { map, filter, prop, not, equals } from 'ramda'

import { projectStreamerRejectedKey } from 'root/src/server/api/lenses'
import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PROJECT)
const { pathOrAssignees } = responseLenses

export default (state, props) => {
	const assignneDidNotRejected = assignee => not(equals(prop('accepted', assignee), projectStreamerRejectedKey))

	return map(
		prop('displayName'),
		filter(assignneDidNotRejected, pathOrAssignees([1], getRecordSelector(state, props))),
	)
}
