import {
	CAPTURE_PROJECT_PAYMENTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { admin } from 'root/src/shared/constants/authenticationTypes'
import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'
import payloadSchema from 'root/src/shared/descriptions/endpoints/schemas/captureProjectPaymentsPayloadSchema'

export default {
	[CAPTURE_PROJECT_PAYMENTS]: {
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
		authentication: admin,
		isLongRunningTask: true,
	},
}
