import apiRequest from 'root/src/client/logic/api/thunks/apiRequest'

import { GET_PLEDGED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default () => async dispatch => dispatch(apiRequest(GET_PLEDGED_PROJECTS))
