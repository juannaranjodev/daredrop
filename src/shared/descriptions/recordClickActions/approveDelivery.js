import { projectDeliveredKey } from 'root/src/server/api/lenses'

import { APPROVE_DELIVERY } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { APPROVE_OR_REJECT_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[APPROVE_DELIVERY]: {
		endpointId: APPROVE_OR_REJECT_DELIVERY,
		payloadMap: [
			['projectId', ':recordId'],
			['audit', projectDeliveredKey],
		],
		label: 'Approve dare',
		onSuccessRecordUpdates: [
			{
				modification: 'set',
				path: [':recordStoreKey', 'status'],
				value: projectDeliveredKey,
			},
		],
	},
}
