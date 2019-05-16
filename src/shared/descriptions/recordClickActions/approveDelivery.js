import { projectDeliveryAcceptedKey } from 'root/src/server/api/lenses'

import { APPROVE_DELIVERY_ACTION } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { APPROVE_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[APPROVE_DELIVERY_ACTION]: {
		endpointId: APPROVE_DELIVERY,
		payloadMap: [
			['projectId', ':recordId'],
		],
		label: 'Approve dare',
		onSuccessRecordUpdates: [
			{
				modification: 'set',
				path: [':recordStoreKey', 'status'],
				value: projectDeliveryAcceptedKey,
			},
		],
	},
}
