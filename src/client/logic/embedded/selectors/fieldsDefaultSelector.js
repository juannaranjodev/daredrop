import { pathOr, map } from 'ramda'

import moduleDescriptions from 'root/src/shared/descriptions/modules'
import fieldsPathDescriptionsSelector from 'root/src/client/logic/embedded/selectors/fieldsPathDescriptionsSelector'

export default (state, props) => map(path => pathOr('', [...path, 'default'], moduleDescriptions), fieldsPathDescriptionsSelector(state, props))
