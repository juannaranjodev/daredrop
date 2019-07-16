import { appStoreLenses } from 'root/src/client/logic/app/lenses'

const { viewPosition } = appStoreLenses

export default (state, props) => viewPosition(state)
