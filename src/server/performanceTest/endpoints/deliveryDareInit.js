import { DELIVERY_DARE_INIT } from 'root/src/server/performanceTest/endpoints/endpointIds'

import { apiFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: DELIVERY_DARE_INIT,
		payload: {
			videoURL: 'http://google.pl',
			timeStamp: '02:02:02',
			videoName: 'VID_20190519_140951.mp4',
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
