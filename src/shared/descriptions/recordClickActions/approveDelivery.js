import { projectDeliveredKey } from 'root/src/shared/descriptions/apiLenses'

import { APPROVE_DELIVERY } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[APPROVE_DELIVERY]: {
		endpointId: REVIEW_DELIVERY,
		payloadMap: [
			['projectId', ':recordId'],
			['audit', projectDeliveredKey],
		],
		label: 'Approve dare',
		onSuccessRecordUpdates: [
			{
				modification: 'set',
				path: ['project', ':recordStoreKey', 'status'],
				value: projectDeliveredKey,
			},
		],
	},
}
