import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { viewSortValue } = listStoreLenses

export default (state, props) => viewSortValue(state)
