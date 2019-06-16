import reduxConnector from 'root/src/shared/util/reduxConnector'

import projectTitleSelector from 'root/src/client/logic/project/selectors/projectTitleSelector'
import projectDescriptionSelector from 'root/src/client/logic/project/selectors/projectDescriptionSelector'
import pledgeAmountSelector from 'root/src/client/logic/project/selectors/pledgeAmountSelector'
import projectGameImagePortraitSelector from 'root/src/client/logic/project/selectors/projectGameImagePortraitSelector'
import projectAssigneesImagesSelector from 'root/src/client/logic/project/selectors/projectAssigneesImagesSelector'
import projectShareUrlSelector from 'root/src/client/logic/project/selectors/projectShareUrlSelector'
import projectGamesSelector from 'root/src/client/logic/project/selectors/projectGamesSelector'
import isAuthenticated from 'root/src/client/logic/auth/selectors/isAuthenticated'
import projectPledgedSelector from 'root/src/client/logic/project/selectors/projectPledgedSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import projectAssigneNameSelector from 'root/src/client/logic/project/selectors/projectAssigneNameSelector'
import projectDeliveriesSelector from 'root/src/client/logic/project/selectors/projectDeliveriesSelector'
import projectAcceptedSelector from 'root/src/client/logic/project/selectors/projectAcceptedSelector'
import listRouteHandlerSelector from 'root/src/client/logic/project/selectors/listRouteHandlerSelector'
import goalProgressSelector from 'root/src/client/logic/project/selectors/goalProgressSelector'
import setTimeoutIdHandler from 'root/src/client/logic/project/handlers/setTimeoutIdHandler'

export default reduxConnector(
	[
		['projectDescription', projectDescriptionSelector],
		['projectTitle', projectTitleSelector],
		['pledgeAmount', pledgeAmountSelector],
		['projectGameImage', projectGameImagePortraitSelector],
		['projectAssigneesImages', projectAssigneesImagesSelector],
		['projectAssigneesName', projectAssigneNameSelector],
		['projectShareUrl', projectShareUrlSelector],
		['projectGames', projectGamesSelector],
		['projectPledged', projectPledgedSelector],
		['goalProgress', goalProgressSelector],
		['projectAccepted', projectAcceptedSelector],
		['isAuthenticated', isAuthenticated],
		['projectDeliveries', projectDeliveriesSelector],
		['listRouteHandler', listRouteHandlerSelector],
	],
	[
		['pushRoute', pushRoute],
		['setTimeoutId', setTimeoutIdHandler],
	],
)
