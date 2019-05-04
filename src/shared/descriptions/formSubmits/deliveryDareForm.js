import { DELIVERY_DARE_FORM_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'

import deliveryDareInit from 'root/src/client/logic/project/thunks/deliveryDareInit'

export default {
	[DELIVERY_DARE_FORM_MODULE_ID]: [
		{
			action: deliveryDareInit,
		},
	],
}
