import urlFromRouteObj from 'root/src/client/logic/route/util/urlFromRouteObj'
import currentRouteParams from 'root/src/client/logic/route/selectors/currentRouteParams'
import origin from 'root/src/shared/constants/origin'
import { isNil } from 'ramda'

import {
	VIEW_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (state, props) => {
	const routeParams = currentRouteParams(state, props)

	if (!isNil(routeParams)) {
		const localUrl = urlFromRouteObj({
			routeId: VIEW_PROJECT_ROUTE_ID,
			routeParams: { recordId: routeParams.recordId },
		})

		return `${origin}${localUrl}`
	}
	return ''
}
