import { projectDeliveryRejectedKey } from 'root/src/server/api/lenses'

import { REJECT_DELIVERY } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { APPROVE_OR_REJECT_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[REJECT_DELIVERY]: {
		endpointId: APPROVE_OR_REJECT_DELIVERY,
		payloadMap: [
			['projectId', ':recordId'],
			['audit', projectDeliveryRejectedKey],
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
