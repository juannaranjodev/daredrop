import { ACCEPT_PROJECT } from 'root/src/server/performanceTest/endpoints/endpointIds'

import { apiFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: ACCEPT_PROJECT,
		payload: {
			amountRequested: 5,
		},
	},
	parameters: [
		{
			name: 'projectId',
			mapFrom: 'id',
		},
	],
	functionArn: apiFunctionArn,
}
