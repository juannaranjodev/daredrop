import { browserHistoryPush } from 'sls-aws/src/client-logic/route/lenses'
import runModuleMounts from 'sls-aws/src/client-logic/route/util/runModuleMounts'
import dispatchCommittedRoute from 'sls-aws/src/client-logic/route/util/dispatchCommittedRoute'


export const pushRouteHof = (
	dispatchCommittedRouteFn,
) => (routeId, routeParams) => (dispatch, getState) => {
	const nextRouteObj = { routeId, routeParams }
	const state = getState()
	runModuleMounts(nextRouteObj, state)
	return dispatchCommittedRouteFn(
		nextRouteObj,
		dispatch,
		browserHistoryPush
	)
}

export default pushRouteHof(dispatchCommittedRoute)
