import {
	GET_FAVORITES_LIST, GET_PLEDGED_PROJECTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import {
	FAVORITES_PROJECTS_LIST_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[FAVORITES_PROJECTS_LIST_MODULE_ID]: {
		moduleType: 'list',
		listType: 'card',
		listPayload: { currentPage: 1 },
		recordType: project,
		endpointId: [GET_FAVORITES_LIST, GET_PLEDGED_PROJECTS],
	},
}
