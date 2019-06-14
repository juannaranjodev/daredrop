import { browserHistoryPush } from 'root/src/client/logic/route/lenses'
import auditRoute from 'root/src/client/logic/route/util/auditRoute'
import runModuleMounts from 'root/src/client/logic/route/util/runModuleMounts'
import dispatchCommittedRoute from 'root/src/client/logic/route/util/dispatchCommittedRoute'
import defaultRoute from 'root/src/client/logic/route/util/defaultRoute'
import { appStoreLenses } from 'root/src/client/logic/app/lenses'
import { forEach, range, add } from 'ramda'

const { viewTimeoutId } = appStoreLenses

export const pushRouteHof = (
	auditRouteFn,
	defaultRouteFn,
	dispatchCommittedRouteFn,
	runModuleMountsFn,
) => (routeId, routeParams) => async (dispatch, getState) => {
	let nextRouteObj = { routeId, routeParams }
	const state = getState()

	const timeoutId = add(viewTimeoutId(state), 1) || 0
	const clearTimeoutFn = t => clearTimeout(t)
	await forEach(clearTimeoutFn, range(0, timeoutId))

	if (nextRouteObj) {
		nextRouteObj = auditRouteFn(nextRouteObj, state)
			? nextRouteObj : defaultRouteFn(state)
	} else {
		nextRouteObj = defaultRouteFn(state)
	}
	dispatch(runModuleMountsFn(nextRouteObj, state))
	return dispatchCommittedRouteFn(
		nextRouteObj,
		dispatch,
		browserHistoryPush,
	)
}

export default pushRouteHof(
	auditRoute,
	defaultRoute,
	dispatchCommittedRoute,
	runModuleMounts,
)
