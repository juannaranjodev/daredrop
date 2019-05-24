import { GET_PENDING_DELIVERIES, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { PENDING_DELIVERIES_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'
import goToReviewProjectHandler from 'root/src/client/logic/project/handlers/goToReviewProjectHandler'

export default {
	[PENDING_DELIVERIES_MODULE_ID]: {
		moduleType: 'list',
		listType: 'card',
		listPayload: { currentPage: 1 },
		recordType: project,
		endpointId: [
			GET_PENDING_DELIVERIES,
			GET_PLEDGED_PROJECTS,
			GET_ACCEPTED_PROJECTS,
		],
		listRouteHandler: goToReviewProjectHandler,
	},
}
