import {
	GET_ACTIVE_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	ACTIVE_PROJECTS_LIST_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'
import goToViewProjectHandler from 'root/src/client/logic/project/handlers/goToViewProjectHandler'

export default {
	[ACTIVE_PROJECTS_LIST_MODULE_ID]: {
		moduleType: 'list',
		listType: 'card',
		listPayload: { currentPage: 1 },
		recordType: project,
		endpointId: [
			GET_ACTIVE_PROJECTS,
			GET_PLEDGED_PROJECTS,
			GET_ACCEPTED_PROJECTS,
		],
		listRouteHandler: goToViewProjectHandler,
	},
}
