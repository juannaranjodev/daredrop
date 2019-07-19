import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'


import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import isAuthenticated from 'root/src/client/logic/auth/selectors/isAuthenticated'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewMyPledge } = responseLenses

export default (state, props) => (isAuthenticated(state) ? viewMyPledge(getRecordSelector(state, props)) : null)
