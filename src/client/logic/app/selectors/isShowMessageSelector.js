import { appStoreLenses } from 'root/src/client/logic/app/lenses'

const { viewShow } = appStoreLenses

export default (state, props) => viewShow(state)
