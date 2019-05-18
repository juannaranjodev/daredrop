import {
	APPROVE_OR_REJECT_DELIVERY,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { admin } from 'root/src/shared/constants/authenticationTypes'
import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import approveOrRejectDeliveryPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/approveOrRejectDeliveryPayloadSchema'
import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'

export const payloadSchema = approveOrRejectDeliveryPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[APPROVE_OR_REJECT_DELIVERY]: {
		authentication: admin,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
	},
}
