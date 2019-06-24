import { REVIEW_DELIVERY } from 'root/src/server/performanceTest/endpoints/endpointIds'
import { projectDeliveredKey } from 'root/src/server/api/lenses'

import { apiLongTaskFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: REVIEW_DELIVERY,
		payload: {
			audit: projectDeliveredKey,
		},
	},
	parameters: [
		{
			name: 'projectId',
			mapTo: 'projectId',
		},
	],
	functionArn: apiLongTaskFunctionArn,
}
