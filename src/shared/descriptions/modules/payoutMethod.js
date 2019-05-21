import { dissocPath, compose, set, lensProp, without, view } from 'ramda'

import {
  MANAGE_PAYOUT_METHOD_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import addPayoutMethodPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/addPayoutMethodPayloadSchema'
import {
  ADD_PAYOUT_METHOD, GET_PAYOUT_METHOD
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
  ACCOUNT_SETTINGS_ROUTE_ID
} from 'root/src/shared/descriptions/routes/routeIds'


export default {
  [MANAGE_PAYOUT_METHOD_MODULE_ID]: {
    moduleType: 'form',
    formType: 'payout',
    schema: compose(
      dissocPath(['properties', 'email']),
      dissocPath(['additionalProperties']),
      set(
        lensProp('required'),
      ),
    )(addPayoutMethodPayloadSchema),
    title: 'Payout Methods',
    fields: [
      {
        fieldId: 'email',
        inputType: 'email',
        labelFieldText: [
          {
            text: 'Paypal email',
            required: false,
          },
        ],
      },
    ],
    submits: [
      {
        label: 'Add Paypal Account',
        buttonType: 'primaryRoundButton',
      },
    ],
    backButton: {
      label: 'Go Back',
      routeId: ACCOUNT_SETTINGS_ROUTE_ID,
    },
    endpointId: [GET_PAYOUT_METHOD]
  },
}
