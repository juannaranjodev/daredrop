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
import approvedVideoUrlSelector from 'root/src/client/logic/project/selectors/approvedVideoUrlSelector'

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
		['isAuthenticated', isAuthenticated],
		['approvedVideoUrl', approvedVideoUrlSelector],
	],
	[['pushRoute', pushRoute]],
)
