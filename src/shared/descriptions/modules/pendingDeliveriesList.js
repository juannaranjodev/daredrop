import { GET_PENDING_DELIVERIES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { PENDING_DELIVERIES_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[PENDING_DELIVERIES_MODULE_ID]: {
		moduleType: 'list',
		lsitType: 'card',
		recordType: project,
		endpointId: [GET_PENDING_DELIVERIES],
	},
}
