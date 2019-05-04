import { GET_PENDING_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { PENDING_PROJECTS_LIST_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[PENDING_PROJECTS_LIST_MODULE_ID]: {
		moduleType: 'list',
		listType: 'card',
		recordType: project,
		listPayload: { currentPage: 1 },
		endpointId: [GET_PENDING_PROJECTS, GET_PLEDGED_PROJECTS, GET_ACCEPTED_PROJECTS,],
		// listItemPrimary: ['title'],
		// listItemSecondary: ['secondary'],
		// onEnterActions: [stupidFn],
	},
}
