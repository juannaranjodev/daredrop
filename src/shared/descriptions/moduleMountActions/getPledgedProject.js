import {
	ACTIVE_PROJECTS_LIST_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import getPledgedProject from 'root/src/client/logic/list/thunks/getPledgedProject'

export default {
	[ACTIVE_PROJECTS_LIST_MODULE_ID]: {
		onEnterActions: [getPledgedProject],
	},
}
