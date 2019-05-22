import getRecordSelector from 'root/src/client/logic/api/selectors/getRecordSelector'

import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getResponseLenses } from 'root/src/server/api/getEndpointDesc'
import { prop, propOr } from 'ramda'

import urlParser from 'js-video-url-parser'

const responseLenses = getResponseLenses(GET_PROJECT)
const { viewDeliveries } = responseLenses

export default (state, props) => {
	const approvedVideoUrl = prop('videoURL', propOr({}, 0, viewDeliveries(getRecordSelector(state, props))))
	const parsedUrl = urlParser.parse(approvedVideoUrl)
	// at the moment selector returns simply url of first delivery in deliveries array
	if (parsedUrl) {
		return urlParser.create({
			videoInfo: parsedUrl,
			format: 'embed',
		})
	}
}
