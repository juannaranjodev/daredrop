import { moduleIdProp } from 'root/src/client/logic/route/lenses'
import { formStoreLenses } from 'root/src/client/logic/form/lenses'

const { viewFormSubmitError } = formStoreLenses

export default (state, { moduleKey }) => viewFormSubmitError( moduleKey ,state )

