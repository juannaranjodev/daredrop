import { GET_PAYMENT_METHODS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { MANAGE_PAYMENT_LIST_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { paymentMethod } from 'root/src/shared/descriptions/endpoints/recordTypes'
import { ACCOUNT_SETTINGS_ROUTE_ID, MANAGE_PAYMENT_FORM_ROUTE_ID } from 'root/src/shared/descriptions/routes/routeIds'

export default {
	[MANAGE_PAYMENT_LIST_MODULE_ID]: {
		moduleType: 'list',
		listType: 'list',
		listTitle: 'Payment Information',
		listSubtitle: 'Credit Card:',
		recordType: paymentMethod,
		endpointId: [GET_PAYMENT_METHODS],
		listControls: [
			{
				title: 'Add Credit Card',
				routeId: MANAGE_PAYMENT_FORM_ROUTE_ID,
				buttonType: 'primaryButton',
			},
			{
				title: 'Go Back',
				routeId: ACCOUNT_SETTINGS_ROUTE_ID,
				buttonType: 'noBackgroundButton',
			},
		],
	},
}
