import reduxConnector from 'root/src/shared/util/reduxConnector'

import bannerImageSelector from 'root/src/client/logic/header/selectors/bannerImageSelector'
import bannerImageTextSelector from 'root/src/client/logic/header/selectors/bannerImageTextSelector'
import bannerSubTextSelector from 'root/src/client/logic/header/selectors/bannerSubTextSelector'
import textWithBg from 'root/src/client/logic/header/selectors/textWithBg'
import createNewDareActive from 'root/src/client/logic/header/selectors/createNewDareActive'
import linkLabelSelector from 'root/src/client/logic/header/selectors/linkLabelSelector'
import linkRouteIdSelector from 'root/src/client/logic/header/selectors/linkRouteIdSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import gameFilterValueSelector from 'root/src/client/logic/header/selectors/gameFilterValueSelector'
import streamerFilterValueSelector from 'root/src/client/logic/header/selectors/streamerFilterValueSelector'
import sortProject from 'root/src/client/logic/header/thunks/sortProject'
import sortValueSelector from 'root/src/client/logic/header/selectors/sortValueSelector'
import isMyProjectsSelector from 'root/src/client/logic/header/selectors/isMyProjectsSelector'
import bannerImageSubTextSelector from '../selectors/bannerImageSubTextSelector'
import embeddedContentSelector from 'root/src/client/logic/header/selectors/embeddedContentSelector'

export default reduxConnector(
	[
		['bannerImage', bannerImageSelector],
		['bannerImageText', bannerImageTextSelector],
		['bannerImageSubText', bannerImageSubTextSelector],
		['bannerSubText', bannerSubTextSelector],
		['textWithBg', textWithBg],
		['createNewDareActive', createNewDareActive],
		['gameFilterValue', gameFilterValueSelector],
		['streamerFilterValue', streamerFilterValueSelector],
		['linkLabel', linkLabelSelector],
		['linkRouteId', linkRouteIdSelector],
		['sortValue', sortValueSelector],
		['isMyProjects', isMyProjectsSelector],
		['embeddedContent', embeddedContentSelector],
	],
	[
		['pushRoute', pushRoute],
		['sortProject', sortProject],
	],
)
