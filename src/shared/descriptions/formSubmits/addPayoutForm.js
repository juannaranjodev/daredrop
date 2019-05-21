import {
	MANAGE_PAYOUT_METHOD_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'

import addPayout from 'root/src/client/logic/payoutMethod/thunks/addPayout'
import addPayoutOnSuccess from 'root/src/client/logic/payoutMethod/thunks/addPayoutOnSuccess'

export default {
	[MANAGE_PAYOUT_METHOD_MODULE_ID]: [
		{
			action: addPayout,
			onSuccess: addPayoutOnSuccess,
		},
	],
}
