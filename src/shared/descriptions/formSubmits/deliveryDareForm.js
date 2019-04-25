import { DELIVERY_DARE_FORM_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'

import deliveryDare from 'root/src/client/logic/project/thunks/deliveryDare'

export default {
	[DELIVERY_DARE_FORM_MODULE_ID]: [
		{
			action: deliveryDare,
		},
	],
}
