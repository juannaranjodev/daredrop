import {
	SET_DEFAULT_PAYMENT_METHOD,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { paymentMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[SET_DEFAULT_PAYMENT_METHOD]: {
		endpointType: recordEndpointType,
		recordType: paymentMethod,
	},
}
