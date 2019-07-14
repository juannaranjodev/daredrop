import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewId } = responseLenses

export default (state, props) => {
	const { acceptedList } = props
	const record = getRecordSelector(state, props)
	return acceptedList.includes(viewId(record))
}
