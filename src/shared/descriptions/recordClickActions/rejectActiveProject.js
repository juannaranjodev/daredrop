import { projectRejectedKey } from 'root/src/shared/descriptions/apiLenses'

import { REJECT_ACTIVE_PROJECT } from 'root/src/shared/descriptions/recordClickActions/recordClickActionIds'

import { AUDIT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[REJECT_ACTIVE_PROJECT]: {
		endpointId: AUDIT_PROJECT,
		payloadMap: [
			['projectId', ':recordId'],
			['audit', projectRejectedKey],
		],
		label: 'Reject',
		onSuccessRecordUpdates: [
			{
				modification: 'set',
				path: ['project', ':recordStoreKey', 'status'],
				value: projectRejectedKey,
			},
		],
	},
}
