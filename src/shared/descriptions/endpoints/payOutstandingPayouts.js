import { PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import payOutstandingPayoutsPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/payOutstandingPayoutsPayloadSchema'

export const payloadSchema = payOutstandingPayoutsPayloadSchema

export default {
	[PAY_OUTSTANDING_PAYOUTS]: {
		payloadSchema,
	},
}
