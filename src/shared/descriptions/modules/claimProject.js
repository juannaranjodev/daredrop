import {
	CLAIM_PROJECT_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { GET_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[CLAIM_PROJECT_MODULE_ID]: {
		moduleType: 'record',
		recordPageType: 'claimProject',
		endpointId: GET_PROJECT,
		recordPayloadMap: [
			['projectId', ':recordId'],
		],
	},
}
