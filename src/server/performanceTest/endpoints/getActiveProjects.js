import { GET_ACTIVE_PROJECTS } from 'root/src/server/performanceTest/endpoints/endpointIds'
import outputs from 'root/cfOutput'

const { apiFunctionArn } = outputs

export default {
	actionEvent: {
		endpointId: GET_ACTIVE_PROJECTS,
		payload: {
			currentPage: 1,
		},
	},
	parameters: [],
	functionArn: apiFunctionArn,
}
