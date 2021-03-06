import {
	GET_MY_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	MY_PROJECTS_LIST_MODULE_ID, MY_PROJECT_BANNER_HEADER_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'
import goToViewProjectHandler from 'root/src/client/logic/project/handlers/goToViewProjectHandler'

export default {
	[MY_PROJECTS_LIST_MODULE_ID]: {
		moduleType: 'list',
		listType: 'card',
		listPayload: { currentPage: 1 },
		recordType: project,
		endpointId: [GET_MY_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS],
		listRouteHandler: goToViewProjectHandler,
		sortFilterModule: MY_PROJECT_BANNER_HEADER_MODULE_ID,
	},
}
