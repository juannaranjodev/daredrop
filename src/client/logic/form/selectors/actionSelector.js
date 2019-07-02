import { path } from 'ramda'

import moduleDescriptions from 'root/src/shared/descriptions/modules'

export default (state, { moduleId, fieldDescPath }) => path([moduleId, ...fieldDescPath, 'action'], moduleDescriptions)
