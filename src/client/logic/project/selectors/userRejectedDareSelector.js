import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewUserRejectedDare } = responseLenses

export default (state, props) => viewUserRejectedDare(getRecordSelector(state, props))
