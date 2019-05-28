import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { viewGameFilterValue } = listStoreLenses

export default (state, props) => viewGameFilterValue(state)
