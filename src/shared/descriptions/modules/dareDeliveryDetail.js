import { DARE_DELIVERY_DETAIL_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[DARE_DELIVERY_DETAIL_MODULE_ID]: {
		moduleType: 'record',
		recordPageType: 'reviewProject',
		endpointId: GET_PROJECT,
		recordPayloadMap: [
			['projectId', ':recordId'],
		],
	},
}
