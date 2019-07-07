import { prop } from 'ramda'

import embeddedContentSelector from 'root/src/client/logic/header/selectors/embeddedContentSelector'

export default (state, props) => prop('fields', embeddedContentSelector(state, props))
