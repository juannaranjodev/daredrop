import { formStoreLenses } from 'root/src/client/logic/form/lenses'

const { viewFormLoadingBlock } = formStoreLenses

export default (state, props) => viewFormLoadingBlock(state)
