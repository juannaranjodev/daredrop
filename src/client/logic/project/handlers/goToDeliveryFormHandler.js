import {
	DELIVERY_DARE_FORM_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (pushRoute, recordId) => () => (
	pushRoute(DELIVERY_DARE_FORM_ROUTE_ID, { recordId })
)
