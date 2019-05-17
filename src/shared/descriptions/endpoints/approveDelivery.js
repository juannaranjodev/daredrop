import {
	APPROVE_DELIVERY,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { admin } from 'root/src/shared/constants/authenticationTypes'
import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import approveDeliveryPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/approveDeliveryPayloadSchema'
import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'

export const payloadSchema = approveDeliveryPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[APPROVE_DELIVERY]: {
		authentication: admin,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
	},
}
