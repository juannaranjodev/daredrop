import { projectDeliveryRejectedKey } from 'root/src/server/api/lenses'

import { REJECT_DELIVERY_ACTION } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { REJECT_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[REJECT_DELIVERY_ACTION]: {
		endpointId: REJECT_DELIVERY,
		payloadMap: [
			['projectId', ':recordId'],
		],
		validation: [{ prop: 'message', type: 'required' }],
		label: 'Reject dare',
		onSuccessRecordUpdates: [
			{
				modification: 'set',
				path: [':recordStoreKey', 'status'],
				value: projectDeliveryRejectedKey,
			},
		],
	},
}
