import { equals } from 'ramda'

import routeDescriptions from 'root/src/shared/descriptions/routes'
import isAuthenticated from 'root/src/client/logic/auth/selectors/isAuthenticated'
import isAdminSelector from 'root/src/client/logic/auth/selectors/isAdminSelector'
import {
	authValue, unAuthValue, routeDescriptionLenses,
} from 'root/src/client/logic/route/lenses'

const { viewAuthentication } = routeDescriptionLenses
export const auditRouteHof = (
	authenticatedFn, routeDescriptionObj
) => ({ routeId }, state) => {
	const routeAuth = viewAuthentication(routeId, routeDescriptionObj)  
	const authenticatedState = authenticatedFn(state) ? authValue : unAuthValue
	return (isAdminSelector(state) || !routeAuth) ? true : equals(routeAuth, authenticatedState)
}

export default auditRouteHof(isAuthenticated, routeDescriptions)
