import { DELIVERY_DARE_INIT } from 'root/src/shared/descriptions/endpoints/endpointIds'

import { authenticated } from 'root/src/shared/constants/authenticationTypes'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import deliveryDareInitPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/deliveryDareInitPayloadSchema'

const payloadSchema = deliveryDareInitPayloadSchema

export default {
	[DELIVERY_DARE_INIT]: {
		authentication: authenticated,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
	},
}
