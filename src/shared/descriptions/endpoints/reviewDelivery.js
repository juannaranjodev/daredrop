import {
	REVIEW_DELIVERY,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { admin } from 'root/src/shared/constants/authenticationTypes'
import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import reviewDeliveryPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/reviewDeliveryPayloadSchema'
import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'

export const payloadSchema = reviewDeliveryPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[REVIEW_DELIVERY]: {
		authentication: admin,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
		isLongRunningTask: true,
	},
}
