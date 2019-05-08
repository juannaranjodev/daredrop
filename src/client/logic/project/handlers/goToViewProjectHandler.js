import {
	VIEW_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'
import { forEach } from 'ramda'

export default (recordId, pushRoute, timeouts) => async () => {
	if (timeouts) {
		const clearTimeoutFn = t => clearTimeout(t)
		await forEach(clearTimeoutFn, timeouts)
	}
	return pushRoute(VIEW_PROJECT_ROUTE_ID, { recordId })
}
