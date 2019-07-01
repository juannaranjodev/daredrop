import { DELIVERY_DARE } from 'root/src/server/performanceTest/endpoints/endpointIds'

import { apiLongTaskFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: DELIVERY_DARE,
		payload: {
			testName: '013b66f3-a680-4508-b6f6-437462e0c05e.mp4',
		},
	},
	parameters: [
		{
			name: 'projectId',
			mapFrom: 'projectId',
		},
		{
			name: 'deliverySortKey',
			mapFrom: 'deliverySortKey',
		},
	],
	functionArn: apiLongTaskFunctionArn,
}
