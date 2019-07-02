import { prop } from 'ramda'

import embededContentSelector from 'root/src/client/logic/header/selectors/embededContentSelector'

export default (state, props) => prop('fields', embededContentSelector(state, props))
