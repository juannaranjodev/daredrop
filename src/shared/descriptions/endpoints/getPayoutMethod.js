import {
	GET_PAYOUT_METHOD,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { payoutMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'
import payoutMethodResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/payoutMethodResponseSchema'

export const responseSchema = payoutMethodResponseSchema

export default {
	[GET_PAYOUT_METHOD]: {
		endpointType: recordEndpointType,
		recordType: payoutMethod,
		responseSchema,
	},
}
