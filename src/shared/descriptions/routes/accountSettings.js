import {
	ACCOUNT_SETTINGS_ROUTE_ID,
	MANAGE_PAYMENT_LIST_ROUTE_ID,
	MANAGE_PAYMENT_FORM_ROUTE_ID,
	CHANGE_PASSWORD_FORM_ROUTE_ID,
	CHANGE_PASSWORD_SUCCESS_ROUTE_ID,
	MANAGE_PAYOUT_METHOD_ID
} from 'root/src/shared/descriptions/routes/routeIds'


import {
	ACCOUNT_SETTINGS_MODULE_ID,
	ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID,
	CHANGE_PASSWORD_FORM_MODULE_ID,
	CHANGE_PASSWORD_SUCCESS_MODULE_ID,
	MANAGE_PAYMENT_LIST_MODULE_ID,
	MANAGE_PAYMENT_FORM_MODULE_ID,
	MANAGE_PAYOUT_METHOD_MODULE_ID
} from 'root/src/shared/descriptions/modules/moduleIds'

import { authValue } from 'root/src/client/logic/route/lenses'

export default {
	[ACCOUNT_SETTINGS_ROUTE_ID]: {
		url: '/account-settings',
		authentication: authValue,
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, ACCOUNT_SETTINGS_MODULE_ID],
	},


	[CHANGE_PASSWORD_FORM_ROUTE_ID]: {
		url: '/change-password',
		authentication: authValue,
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, CHANGE_PASSWORD_FORM_MODULE_ID],
	},
	[CHANGE_PASSWORD_SUCCESS_ROUTE_ID]: {
		url: '/change-password-success',
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, CHANGE_PASSWORD_SUCCESS_MODULE_ID],
	},


	[MANAGE_PAYMENT_LIST_ROUTE_ID]: {
		url: '/manage-payment',
		authentication: authValue,
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, MANAGE_PAYMENT_LIST_MODULE_ID],
	},

	[MANAGE_PAYMENT_FORM_ROUTE_ID]: {
		url: '/add-payment',
		authentication: authValue,
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, MANAGE_PAYMENT_FORM_MODULE_ID],
	},

	[MANAGE_PAYOUT_METHOD_ID]: {
		url: '/payout-method',
		authentication: authValue,
		modules: [ACCOUNT_SETTINGS_BANNER_HEADER_MODULE_ID, MANAGE_PAYOUT_METHOD_MODULE_ID]
	}
}
