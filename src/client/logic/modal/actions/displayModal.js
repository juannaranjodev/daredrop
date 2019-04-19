import { DISPLAY_MODAL } from 'root/src/client/logic/modal/actionIds'

export default (modalVisible, moduleId) => ({
  type: DISPLAY_MODAL,
  payload: { modalVisible, moduleId },
}) 