import urlFromRouteObj from 'root/src/client/logic/route/util/urlFromRouteObj'
import origin from 'root/src/shared/constants/origin'
import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import {
	VIEW_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (state, props) => {
	const record = getRecordSelector(state, props)
	if (record === undefined) return ''
	const { id } = record
	const localUrl = urlFromRouteObj({
		routeId: VIEW_PROJECT_ROUTE_ID,
		routeParams: { recordId: id },
	})
	return `${origin}${localUrl}`
}
