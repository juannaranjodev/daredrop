import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'

import { authenticated } from 'root/src/shared/constants/authenticationTypes'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import deliveryDarePayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/deliveryDarePayloadSchema'
import deliveryDarePayloadTestingSchema from 'root/src/shared/descriptions/endpoints/schemas/deliveryDarePayloadTestingSchema'

const payloadSchema = deliveryDarePayloadSchema
const testingPayloadSchema = deliveryDarePayloadTestingSchema

export default {
	[DELIVERY_DARE]: {
		authentication: authenticated,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
		testingPayloadSchema,
		isLongRunningTask: true,
	},
}
