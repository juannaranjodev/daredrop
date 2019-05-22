import { map } from 'ramda'

import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'

import createProject from 'root/src/shared/descriptions/endpoints/createProject'
import savePartialDareForm from 'root/src/shared/descriptions/endpoints/savePartialDareForm'
import getProject from 'root/src/shared/descriptions/endpoints/getProject'
import pledgeProject from 'root/src/shared/descriptions/endpoints/pledgeProject'
import getPledgedProjects from 'root/src/shared/descriptions/endpoints/getPledgedProjects'
import auditProject from 'root/src/shared/descriptions/endpoints/auditProject'
import updateProject from 'root/src/shared/descriptions/endpoints/updateProject'

import getPaymentMethods from 'root/src/shared/descriptions/endpoints/getPaymentMethods'
import getPaymentMethod from 'root/src/shared/descriptions/endpoints/getPaymentMethod'
import addPaymentMethod from 'root/src/shared/descriptions/endpoints/addPaymentMethod'
import deletePaymentMethod from 'root/src/shared/descriptions/endpoints/deletePaymentMethod'

import addPayoutMethod from 'root/src/shared/descriptions/endpoints/addPayoutMethod'
import getPayoutMethod from 'root/src/shared/descriptions/endpoints/getPayoutMethod'
import updatePayoutMethod from 'root/src/shared/descriptions/endpoints/updatePayoutMethod'

import acceptProject from 'root/src/shared/descriptions/endpoints/acceptProject'
import rejectProject from 'root/src/shared/descriptions/endpoints/rejectProject'

import setDefaultPaymentMethod from 'root/src/shared/descriptions/endpoints/setDefaultPaymentMethod'
import authTwitch from 'root/src/shared/descriptions/endpoints/authTwitch'
import getAuthTokens from 'root/src/shared/descriptions/endpoints/getAuthTokens'

import getActiveProjects from 'root/src/shared/descriptions/endpoints/getActiveProjects'
import getPendingProjects from 'root/src/shared/descriptions/endpoints/getPendingProjects'
import getFavoritesList from 'root/src/shared/descriptions/endpoints/getFavoritesList'
import getMyProjects from 'root/src/shared/descriptions/endpoints/getMyProjects'
import getPendingDeliveries from 'root/src/shared/descriptions/endpoints/getPendingDeliveries'

import auditFavorites from 'root/src/shared/descriptions/endpoints/auditFavorites'
import removeToFavorites from 'root/src/shared/descriptions/endpoints/removeToFavorites'
import deliveryDareInit from 'root/src/shared/descriptions/endpoints/deliveryDareInit'
import deliveryDare from 'root/src/shared/descriptions/endpoints/deliveryDare'

import getAcceptedProjects from 'root/src/shared/descriptions/endpoints/getAcceptedProject'

const allEndpoints = {
	...createProject,
	...getProject,
	...pledgeProject,
	...getPledgedProjects,
	...auditProject,
	...getActiveProjects,
	...getPendingProjects,
	...getFavoritesList,
	...authTwitch,
	...getAuthTokens,
	...savePartialDareForm,
	...getPaymentMethods,
	...getPaymentMethod,
	...addPaymentMethod,
	...deletePaymentMethod,
	...setDefaultPaymentMethod,
	...updateProject,
	...acceptProject,
	...rejectProject,
	...auditFavorites,
	...removeToFavorites,
	...getMyProjects,
	...getPendingDeliveries,
	...deliveryDareInit,
	...deliveryDare,
	...getAcceptedProjects,
	...addPayoutMethod,
	...getPayoutMethod,
	...updatePayoutMethod
}

export default map(
	endpoint => ({
		payloadLenses: lensesFromSchema(endpoint.payloadSchema),
		responseLenses: lensesFromSchema(endpoint.responseSchema),
		...endpoint,
	}),
	allEndpoints,
)
