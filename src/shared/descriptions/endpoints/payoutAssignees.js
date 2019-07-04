import { PAYOUT_ASSIGNEES } from 'root/src/shared/descriptions/endpoints/endpointIds'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import payoutAssigneesPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/payoutAssigneesPayloadSchema'

export const payloadSchema = payoutAssigneesPayloadSchema

export default {
	[PAYOUT_ASSIGNEES]: {
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
	},
}
