import {
	CREATE_PROJECT_ROUTE_ID, VIEW_PROJECT_ROUTE_ID,
	PENDING_PROJECTS_ROUTE_ID, ACTIVE_PROJECTS_ROUTE_ID,
	PLEDGE_PROJECT_ROUTE_ID, MY_PROJECTS_ROUTE_ID,
	PENDING_DELIVERIES_ROUTE_ID, PLEDGE_SUCCESS_PAGE_ROUTE_ID, CLAIM_PROJECT_ROUTE_ID,
	FAVORITES_PROJECTS_ROUTE_ID, DELIVER_DARE_SUCCESS_ROUTE_ID,
	DELIVERY_DARE_FORM_ROUTE_ID, DARE_DELIVERY_DETAIL_ROUTE_ID, 
	DARE_ACCEPT_SUCCESS_ROUTE_ID, DARE_REJECT_SUCCESS_ROUTE_ID
} from 'root/src/shared/descriptions/routes/routeIds'

import {
	CREATE_PROJECT_FORM_MODULE_ID, VIEW_PROJECT_MODULE_ID,
	PENDING_PROJECTS_LIST_MODULE_ID, ACTIVE_PROJECTS_LIST_MODULE_ID,
	PLEDGE_PROJECT_FORM_MODULE_ID, MARKETPLACE_BANNER_HEADER_MODULE_ID,
	STEPER_HEADER_MODULE_ID, TITLE_HEADER_MARKETPLACE_MODULE_ID,
	MY_PROJECT_BANNER_HEADER_MODULE_ID, FAVORITES_PROJECTS_LIST_MODULE_ID,
	DELIVER_DARE_SUCCESS_MODULE_ID, PLEDGE_SUCCESS_PAGE_MODULE_ID,
	BANNER_FOOTER_MARKETPLACE_MODULE_ID, PENDING_DELIVERIES_MODULE_ID,
	BANNER_FOOTER_YOUR_DARE_MODULE_ID, MY_PROJECTS_LIST_MODULE_ID,
	TITLE_HEADER_PENDING_DELIVERIES_MODULE_ID,
	CLAIM_PROJECT_MODULE_ID, CLAIM_PROJECT_FORM_MODULE_ID,
	REJECT_PROJECT_MODAL_MODULE_ID, DELIVERY_DARE_FORM_MODULE_ID,
	DARE_DELIVERY_DETAIL_MODULE_ID, ACCEPT_DARE_SUCCESS_MODULE_ID,
	REJECT_DARE_SUCCESS_MODULE_ID
} from 'root/src/shared/descriptions/modules/moduleIds'

import { authValue } from 'root/src/client/logic/route/lenses'
import { admin } from 'root/src/shared/constants/authenticationTypes'

export default {
	[CREATE_PROJECT_ROUTE_ID]: {
		url: '/create-project',
		authentication: authValue,
		modules: [
			CREATE_PROJECT_FORM_MODULE_ID,
		],
	},
	[DARE_DELIVERY_DETAIL_ROUTE_ID]: {
		url: '/review-project/:recordId',
		authentication: admin,
		modules: [
			DARE_DELIVERY_DETAIL_MODULE_ID,
		],
	},
	[VIEW_PROJECT_ROUTE_ID]: {
		url: '/view-project/:recordId',
		modules: [
			VIEW_PROJECT_MODULE_ID,
		],
	},
	[CLAIM_PROJECT_ROUTE_ID]: {
		url: '/claim-project/:recordId',
		authentication: authValue,
		modules: [
			CLAIM_PROJECT_FORM_MODULE_ID,
			CLAIM_PROJECT_MODULE_ID,
			REJECT_PROJECT_MODAL_MODULE_ID,
		],
	},
	[DARE_ACCEPT_SUCCESS_ROUTE_ID]: {
		url: '/accept-success/:recordId',
		modules: [
			ACCEPT_DARE_SUCCESS_MODULE_ID,
		],
	},
	[DARE_REJECT_SUCCESS_ROUTE_ID]: {
		url: '/reject-success/:recordId',
		modules: [
			REJECT_DARE_SUCCESS_MODULE_ID,
		],
	},
	[PENDING_PROJECTS_ROUTE_ID]: {
		url: '/pending-projects',
		authentication: admin,
		modules: [
			PENDING_PROJECTS_LIST_MODULE_ID,
		],
	},
	[PENDING_DELIVERIES_ROUTE_ID]: {
		url: '/pending-videos',
		authentication: admin,
		modules: [
			TITLE_HEADER_PENDING_DELIVERIES_MODULE_ID,
			PENDING_DELIVERIES_MODULE_ID,
		],
	},
	[ACTIVE_PROJECTS_ROUTE_ID]: {
		url: '/marketplace',
		modules: [
			MARKETPLACE_BANNER_HEADER_MODULE_ID,
			STEPER_HEADER_MODULE_ID,
			TITLE_HEADER_MARKETPLACE_MODULE_ID,
			ACTIVE_PROJECTS_LIST_MODULE_ID,
		],
	},
	[FAVORITES_PROJECTS_ROUTE_ID]: {
		url: '/favorites-projects',
		authentication: authValue,
		modules: [
			MY_PROJECT_BANNER_HEADER_MODULE_ID,
			FAVORITES_PROJECTS_LIST_MODULE_ID,
		],
	},
	[MY_PROJECTS_ROUTE_ID]: {
		url: '/my-projects',
		authentication: authValue,
		modules: [
			MY_PROJECT_BANNER_HEADER_MODULE_ID,
			MY_PROJECTS_LIST_MODULE_ID,
		],
	},
	[PLEDGE_PROJECT_ROUTE_ID]: {
		url: '/pledge-project/:recordId',
		authentication: authValue,
		modules: [
			PLEDGE_PROJECT_FORM_MODULE_ID,
		],
	},
	[PLEDGE_SUCCESS_PAGE_ROUTE_ID]: {
		url: '/pledge-success/:recordId',
		authentication: authValue,
		modules: [
			PLEDGE_SUCCESS_PAGE_MODULE_ID,
		],
	},
	[DELIVER_DARE_SUCCESS_ROUTE_ID]: {
		url: '/deliver-success',
		authentication: authValue,
		modules: [
			DELIVER_DARE_SUCCESS_MODULE_ID,
		],
	},
	[DELIVERY_DARE_FORM_ROUTE_ID]: {
		url: '/delivery-dare/:recordId',
		authentication: authValue,
		modules: [
			DELIVERY_DARE_FORM_MODULE_ID,
		],
	},
}
