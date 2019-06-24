import { AUDIT_PROJECT } from 'root/src/server/performanceTest/endpoints/endpointIds'
import { projectApprovedKey } from 'root/src/server/api/lenses'

import { apiFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: AUDIT_PROJECT,
		payload: {
			audit: projectApprovedKey,
		},
	},
	parameters: [
		{
			name: 'projectId',
			mapTo: 'id',
		},
	],
	functionArn: apiFunctionArn,
}
