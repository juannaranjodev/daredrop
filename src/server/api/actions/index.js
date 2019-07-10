import {
	GET_PROJECT, CREATE_PROJECT, PLEDGE_PROJECT, GET_PLEDGED_PROJECTS,
	GET_OAUTH_TOKENS, ADD_OAUTH_TOKEN, CLEAR_PARTIAL_FORM_KEYS,
	AUDIT_PROJECT, GET_ACTIVE_PROJECTS, GET_PENDING_PROJECTS,
	GET_PAYMENT_METHODS, ADD_PAYMENT_METHOD, DELETE_PAYMENT_METHOD, UPDATE_PROJECT,
	SAVE_PARTIAL_DARE_FORM, ACCEPT_PROJECT, REJECT_PROJECT,
	SET_DEFAULT_PAYMENT_METHOD, AUDIT_FAVORITES,
	GET_FAVORITES_LIST, GET_MY_PROJECTS, GET_ACCEPTED_PROJECTS,
	DELIVERY_DARE_INIT, DELIVERY_DARE,
	ADD_PAYOUT_METHOD, GET_PAYOUT_METHOD, UPDATE_PAYOUT_METHOD,
	GET_PENDING_DELIVERIES, REVIEW_DELIVERY, GET_PROJECT_ADMIN,
	CAPTURE_PROJECT_PAYMENTS, CLEAR_PROJECT_RECORDS,
	COPY_DB_RECORDS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import getProject from 'root/src/server/api/actions/getProject'
import createProject from 'root/src/server/api/actions/createProject'
import pledgeProject from 'root/src/server/api/actions/pledgeProject'
import getPledgedProjects from 'root/src/server/api/actions/getPledgedProjects'
import auditProject from 'root/src/server/api/actions/auditProject'
import getActiveProjects from 'root/src/server/api/actions/getActiveProjects'
import getPendingProjects from 'root/src/server/api/actions/getPendingProjects'
import getOAuthTokens from 'root/src/server/api/actions/getOAuthTokens'
import addOAuthToken from 'root/src/server/api/actions/addOAuthToken'
import savePartialDareForm from 'root/src/server/api/actions/savePartialDareForm'
import clearPartialFormKeys from 'root/src/server/api/actions/clearPartialFormKeys'
import getFavoritesList from 'root/src/server/api/actions/getFavoritesList'
import getPaymentMethods from 'root/src/server/api/actions/getPaymentMethods'
import addPaymentMethod from 'root/src/server/api/actions/addPaymentMethod'
import deletePaymentMethod from 'root/src/server/api/actions/deletePaymentMethod'
import setDafaultPaymentMethod from 'root/src/server/api/actions/setDefaultPaymentMethod'
import updateProject from 'root/src/server/api/actions/updateProject'
import acceptProject from 'root/src/server/api/actions/acceptProject'
import rejectProject from 'root/src/server/api/actions/rejectProject'
import auditFavorites from 'root/src/server/api/actions/auditFavorites'
import getMyProjects from 'root/src/server/api/actions/getMyProjects'
import getPendingDeliveries from 'root/src/server/api/actions/getPendingDeliveries'
import getAcceptProject from 'root/src/server/api/actions/getAcceptProject'
import deliveryDareInit from 'root/src/server/api/actions/deliveryDareInit'
import deliveryDare from 'root/src/server/api/actions/deliveryDare'
import reviewDelivery from 'root/src/server/api/actions/reviewDelivery'
import getProjectAdmin from 'root/src/server/api/actions/getProjectAdmin'

import addPayoutMethod from 'root/src/server/api/actions/addPayoutMethod'
import getPayoutMethod from 'root/src/server/api/actions/getPayoutMethod'
import updatePayoutMethod from 'root/src/server/api/actions/updatePayoutMethod'
import captureProjectPayments from 'root/src/server/api/actions/captureProjectPayments'

import clearProjectRecordsTestDb from 'root/src/server/api/actions/clearProjectRecordsTestDb'
import copyDBRecords from 'root/src/server/api/actions/copyDBRecords'

export default {
	shortRunningTask: {
		[CREATE_PROJECT]: createProject,
		[GET_PROJECT]: getProject,
		[GET_PROJECT_ADMIN]: getProjectAdmin,
		[UPDATE_PROJECT]: updateProject,

		[PLEDGE_PROJECT]: pledgeProject,
		[GET_PLEDGED_PROJECTS]: getPledgedProjects,
		[GET_MY_PROJECTS]: getMyProjects,

		[AUDIT_FAVORITES]: auditFavorites,

		[AUDIT_PROJECT]: auditProject,

		[GET_ACTIVE_PROJECTS]: getActiveProjects,
		[GET_PENDING_PROJECTS]: getPendingProjects,
		[GET_PENDING_DELIVERIES]: getPendingDeliveries,

		[GET_OAUTH_TOKENS]: getOAuthTokens,
		[ADD_OAUTH_TOKEN]: addOAuthToken,
		[GET_FAVORITES_LIST]: getFavoritesList,
		[SAVE_PARTIAL_DARE_FORM]: savePartialDareForm,
		[CLEAR_PARTIAL_FORM_KEYS]: clearPartialFormKeys,

		[GET_PAYMENT_METHODS]: getPaymentMethods,
		[ADD_PAYMENT_METHOD]: addPaymentMethod,
		[DELETE_PAYMENT_METHOD]: deletePaymentMethod,

		[ACCEPT_PROJECT]: acceptProject,
		[REJECT_PROJECT]: rejectProject,
		[SET_DEFAULT_PAYMENT_METHOD]: setDafaultPaymentMethod,

		[DELIVERY_DARE_INIT]: deliveryDareInit,

		[GET_ACCEPTED_PROJECTS]: getAcceptProject,


		[ADD_PAYOUT_METHOD]: addPayoutMethod,
		[GET_PAYOUT_METHOD]: getPayoutMethod,
		[UPDATE_PAYOUT_METHOD]: updatePayoutMethod,

		...(process.env.STAGE !== 'production'
			? {
				[CLEAR_PROJECT_RECORDS]: clearProjectRecordsTestDb,
				[COPY_DB_RECORDS]: copyDBRecords,
			} : {}),
	},
	longRunningTask: {
		[DELIVERY_DARE]: deliveryDare,
		[CAPTURE_PROJECT_PAYMENTS]: captureProjectPayments,
		[REVIEW_DELIVERY]: reviewDelivery,
	},
}
