import { PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import cronJobPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/cronJobPayloadSchema'

export const payloadSchema = cronJobPayloadSchema

export default {
	[PAY_OUTSTANDING_PAYOUTS]: {
		payloadSchema,
	},
}
