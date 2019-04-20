import { REJECT_PROJECT_MODAL_MODULE_ID, CLAIM_PROJECT_FORM_MODULE_ID } from 'root/src/shared/descriptions/modules/moduleIds'

export default {
	[REJECT_PROJECT_MODAL_MODULE_ID]: {
		moduleType: 'modal',
		modalType: 'rejectProjectModal',
		modalTitle: 'Reject Dare',
		modalText: 'This Dare will be gone forever. This may disappoint fans who already pledged. Let them know why.',
		moduleId: CLAIM_PROJECT_FORM_MODULE_ID,
	},
}
