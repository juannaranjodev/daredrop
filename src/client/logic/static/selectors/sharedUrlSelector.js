import urlFromRouteObj from 'root/src/client/logic/route/util/urlFromRouteObj'
import currentRouteParams from 'root/src/client/logic/route/selectors/currentRouteParams'
import origin from 'root/src/shared/constants/origin'

import {
	VIEW_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (state, props) => {
	const routeParams = currentRouteParams(state, props)
	if (routeParams) {
		const localUrl = urlFromRouteObj({
			routeId: VIEW_PROJECT_ROUTE_ID,
			routeParams: { recordId: String(routeParams.recordId) },
		})

		return `${origin}${localUrl}`
	}
	return ''
}
