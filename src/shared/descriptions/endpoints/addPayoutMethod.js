import {
  ADD_PAYOUT_METHOD,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { authenticated } from 'root/src/shared/constants/authenticationTypes'
import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { payoutMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'
import addPayoutMethodPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/addPayoutMethodPayloadSchema'

export const payloadSchema = addPayoutMethodPayloadSchema

export default {
  [ADD_PAYOUT_METHOD]: {
    authentication: authenticated,
    endpointType: recordEndpointType,
    recordType: payoutMethod,
    payloadSchema,
  },
}
