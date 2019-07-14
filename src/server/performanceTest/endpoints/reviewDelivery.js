import { REVIEW_DELIVERY } from 'root/src/server/performanceTest/endpoints/endpointIds'
import { projectDeliveredKey } from 'root/src/shared/descriptions/apiLenses'

import outputs from 'root/cfOutput'

const { apiLongTaskFunctionArn } = outputs

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
			mapFrom: 'projectId',
		},
	],
	functionArn: apiLongTaskFunctionArn,
}
