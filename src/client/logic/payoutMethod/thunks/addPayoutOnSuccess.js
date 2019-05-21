import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'

import {
  ACCOUNT_SETTINGS_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'
import addPayoutMethodOnSuccess from 'root/src/client/logic/payoutMethod/actions/addPayoutMethodOnSuccess'

export default payload => (dispatch) => {
  dispatch(pushRoute(ACCOUNT_SETTINGS_ROUTE_ID))
  return dispatch(addPayoutMethodOnSuccess(payload))
}
