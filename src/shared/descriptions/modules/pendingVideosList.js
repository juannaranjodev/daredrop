import { GET_PENDING_VIDEOS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { PENDING_VIDEOS_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[PENDING_VIDEOS_MODULE_ID]: {
		moduleType: 'list',
		recordType: project,
		endpointId: GET_PENDING_VIDEOS,
	},
}
