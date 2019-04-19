import displayModal from 'root/src/client/logic/modal/actions/displayModal'

export default (modalVisible, moduleKey) => (dispatch, getState) => dispatch(displayModal(modalVisible, moduleKey))
