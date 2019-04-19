import {
  CLAIM_PROJECT_FORM_MODULE_ID,
} from 'root/src/shared/descriptions/modules/moduleIds'
import displayModal from 'root/src/client/logic/modal/thunks/displayModal'

export default {
  [CLAIM_PROJECT_FORM_MODULE_ID]: [
    {
      action: displayModal,
      args: [true],
    },
  ],
}