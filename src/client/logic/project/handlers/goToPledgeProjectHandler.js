import {
	PLEDGE_PROJECT_ROUTE_ID,
} from 'root/src/shared/descriptions/routes/routeIds'

export default (payload, pushRoute) => () => (
	pushRoute(PLEDGE_PROJECT_ROUTE_ID, payload)
)
