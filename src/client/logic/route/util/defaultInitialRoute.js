import {
	ACTIVE_PROJECTS_ROUTE_ID, LOGIN_ROUTE_ID
} from 'root/src/shared/descriptions/routes/routeIds'

export default (nextRoute) => ({ routeId: nextRoute ? LOGIN_ROUTE_ID : ACTIVE_PROJECTS_ROUTE_ID , routeParams: {} })
