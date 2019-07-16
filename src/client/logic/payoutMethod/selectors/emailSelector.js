import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PAYOUT_METHOD } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PAYOUT_METHOD)
const { viewEmail } = responseLenses

export default (state, props) => viewEmail(getRecordSelector(state, props))
