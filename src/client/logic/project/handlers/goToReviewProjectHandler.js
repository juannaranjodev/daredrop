import {
	DARE_DELIVERY_DETAIL_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (recordId, pushRoute) => () => pushRoute(DARE_DELIVERY_DETAIL_ROUTE_ID, { recordId })
