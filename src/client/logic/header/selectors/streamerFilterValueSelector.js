import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { viewStreamerFilterValue } = listStoreLenses

export default (state, props) => viewStreamerFilterValue(state)
