import { projectDeliveryRejectedKey } from 'root/src/shared/descriptions/apiLenses'

import { REJECT_DELIVERY } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'
import { REVIEW_DELIVERY } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[REJECT_DELIVERY]: {
		endpointId: REVIEW_DELIVERY,
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
