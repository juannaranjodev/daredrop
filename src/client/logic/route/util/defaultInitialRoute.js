import { prop, equals, includes } from 'ramda'
import {
	ACTIVE_PROJECTS_ROUTE_ID, 
	LOGIN_ROUTE_ID, 
	ACCOUNT_SETTINGS_ROUTE_ID,
	CHANGE_PASSWORD_ROUTE_ID,
	CHANGE_PASSWORD_FORM_ROUTE_ID,
	CHANGE_PASSWORD_SUCCESS_ROUTE_ID,
	MANAGE_PAYMENT_LIST_ROUTE_ID,
	MANAGE_PAYMENT_FORM_ROUTE_ID,
	MANAGE_PAYMENT_ROUTE_ID,
	MANAGE_PAYOUT_METHOD_ID,
} from 'root/src/shared/descriptions/routes/routeIds'
import isAuthenticated from 'root/src/client/logic/auth/selectors/isAuthenticated'

const defaultRouteHof = (
	isUserFn,
) => (state, nextRoute) => {
	let route = ''
	if (includes(prop('routeId', nextRoute), [
		ACCOUNT_SETTINGS_ROUTE_ID, 
		CHANGE_PASSWORD_ROUTE_ID,
		CHANGE_PASSWORD_FORM_ROUTE_ID,
		CHANGE_PASSWORD_SUCCESS_ROUTE_ID,
		MANAGE_PAYMENT_LIST_ROUTE_ID,
		MANAGE_PAYMENT_FORM_ROUTE_ID,
		MANAGE_PAYMENT_ROUTE_ID, 
		MANAGE_PAYOUT_METHOD_ID]))
		route = LOGIN_ROUTE_ID
	else
		route = ACTIVE_PROJECTS_ROUTE_ID

	return { routeId: isUserFn(state) ? ACTIVE_PROJECTS_ROUTE_ID : route, routeParams: {} }
}
export default defaultRouteHof(isAuthenticated)