import {
	GET_ACTIVE_PROJECTS, CREATE_PROJECT, AUDIT_PROJECT, ACCEPT_PROJECT,
	DELIVERY_DARE_INIT, DELIVERY_DARE, REVIEW_DELIVERY,
} from 'root/src/server/performanceTest/endpoints/endpointIds'

import getActiveProjects from 'root/src/server/performanceTest/endpoints/getActiveProjects'
import createProject from 'root/src/server/performanceTest/endpoints/createProject'
import auditProject from 'root/src/server/performanceTest/endpoints/auditProject'
import acceptProject from 'root/src/server/performanceTest/endpoints/acceptProject'
import deliveryDareInit from 'root/src/server/performanceTest/endpoints/deliveryDareInit'
import deliveryDare from 'root/src/server/performanceTest/endpoints/deliveryDare'
import reviewDelivery from 'root/src/server/performanceTest/endpoints/reviewDelivery'

export default {
	[GET_ACTIVE_PROJECTS]: getActiveProjects,
	[CREATE_PROJECT]: createProject,
	[AUDIT_PROJECT]: auditProject,
	[ACCEPT_PROJECT]: acceptProject,
	[DELIVERY_DARE_INIT]: deliveryDareInit,
	[DELIVERY_DARE]: deliveryDare,
	[REVIEW_DELIVERY]: reviewDelivery,
}
