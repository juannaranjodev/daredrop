import { map, prop } from 'ramda'

import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PROJECT)
const { pathOrAssignees } = responseLenses

export default (state, props) => map(
	prop(
		'displayName',
	),
	pathOrAssignees([1], getRecordSelector(state, props)),
)
