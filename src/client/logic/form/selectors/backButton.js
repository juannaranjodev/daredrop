import { moduleIdProp, currentRouteIndex, routeStoreLenses } from 'root/src/client/logic/route/lenses'
import {
	formModuleLenses,
} from 'root/src/client/logic/form/lenses'
import moduleDescriptions from 'root/src/shared/descriptions/modules'

const { viewRouteParams } = routeStoreLenses

const { viewBackButton } = formModuleLenses

export default (state, props) => {
	const routeParam = viewRouteParams(currentRouteIndex, state)
	const backButton = viewBackButton(
		moduleIdProp(props), moduleDescriptions,
	)

	if (routeParam && routeParam.backPage) {
		return {
			...backButton,
			routeId: routeParam.backPage.routeId,
			routeParams: routeParam.backPage.routeParams,
		}
	}
	return backButton
}
