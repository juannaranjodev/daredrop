import {
	REJECT_DELIVERY,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import rejectDeliveryPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/rejectDeliveryPayloadSchema'
import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'

export const payloadSchema = rejectDeliveryPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[REJECT_DELIVERY]: {
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
	},
}
