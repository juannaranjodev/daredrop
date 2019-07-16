import { appStoreLenses } from 'root/src/client/logic/app/lenses'

const { viewText } = appStoreLenses

export default (state, props) => viewText(state)
