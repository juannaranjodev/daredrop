import { CREATE_PROJECT } from 'root/src/server/performanceTest/endpoints/endpointIds'

import { apiFunctionArn } from 'root/cfOutput'

export default {
	actionEvent: {
		endpointId: CREATE_PROJECT,
		payload: {
			assignees: [
				{
					label: 'piekarskid',
					id: 419843502,
					value: 419843502,
					image: 'https://static-cdn.jtvnw.net/user-default-pictures/27103734-3cda-44d6-a384-f2ab71e4bb85-profile_image-300x300.jpg',
				},
			],
			title: '2',
			description: '2',
			games: [{ label: 'Poker', id: 488190, value: 488190, image: 'https://static-cdn.jtvnw.net/ttv-boxart/Poker-52x72.jpg' }],
			pledgeAmount: 5,
			paymentInfo: { paymentType: 'stripeCard', paymentId: 'src_1EnbIDGe99c40zVyhcObZ1Sa', paymentAmount: 5 },
		},
	},
	parameters: [],
	functionArn: apiFunctionArn,
}
