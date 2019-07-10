import { listStoreLenses } from 'root/src/client/logic/list/lenses'

const { viewLoadingBlockVisible } = listStoreLenses

export default state => viewLoadingBlockVisible(state)
