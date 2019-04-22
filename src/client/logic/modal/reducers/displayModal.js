
import { DISPLAY_MODAL } from 'root/src/client/logic/modal/actionIds'
import { modalStoreLenses } from 'root/src/client/logic/modal/lenses'

const { setModalVisible } = modalStoreLenses

export default {
  [DISPLAY_MODAL]: (state, { modalVisible, moduleId }) => setModalVisible(modalVisible, moduleId, state),
}