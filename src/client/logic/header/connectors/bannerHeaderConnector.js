import reduxConnector from 'root/src/shared/util/reduxConnector'

import bannerImageSelector from 'root/src/client/logic/header/selectors/bannerImageSelector'
import bannerImageTextSelector from 'root/src/client/logic/header/selectors/bannerImageTextSelector'
import bannerSubTextSelector from 'root/src/client/logic/header/selectors/bannerSubTextSelector'
import textWithBg from 'root/src/client/logic/header/selectors/textWithBg'
import createNewDareActive from 'root/src/client/logic/header/selectors/createNewDareActive'
import linkLabelSelector from 'root/src/client/logic/header/selectors/linkLabelSelector'
import loadOptionsPromise from 'root/src/client/logic/header/selectors/loadOptionsPromise'
import linkRouteIdSelector from 'root/src/client/logic/header/selectors/linkRouteIdSelector'
import pushRoute from 'root/src/client/logic/route/thunks/pushRoute'
import filterProjectByGame from 'root/src/client/logic/header/thunk/filterProjectByGame'
import filterProjectByStreamer from 'root/src/client/logic/header/thunk/filterProjectByStreamer'
import gameFilterValueSelector from 'root/src/client/logic/header/selectors/gameFilterValueSelector'
import streamerFilterValueSelector from 'root/src/client/logic/header/selectors/streamerFilterValueSelector'
import sortProject from 'root/src/client/logic/header/thunk/sortProject'
import bannerImageSubTextSelector from '../selectors/bannerImageSubTextSelector'

export default reduxConnector(
	[
		['bannerImage', bannerImageSelector],
		['bannerImageText', bannerImageTextSelector],
		['bannerImageSubText', bannerImageSubTextSelector],
		['bannerSubText', bannerSubTextSelector],
		['textWithBg', textWithBg],
		['loadOptionsPromise', loadOptionsPromise],
		['createNewDareActive', createNewDareActive],
		['gameFilterValue', gameFilterValueSelector],
		['streamerFilterValue', streamerFilterValueSelector],
		['linkLabel', linkLabelSelector],
		['linkRouteId', linkRouteIdSelector],
	],
	[
		['pushRoute', pushRoute],
		['filterProjectByGame', filterProjectByGame],
		['filterProjectByStreamer', filterProjectByStreamer],
		['sortProject', sortProject],
	],
)
