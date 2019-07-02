import { pathOr, map } from 'ramda'

import moduleDescriptions from 'root/src/shared/descriptions/modules'
import fieldsPathDescriptionsSelector from 'root/src/client/logic/embeded/selectors/fieldsPathDescriptionsSelector'

export default (state, props) => map(path => pathOr('', [...path, 'endpointId'], moduleDescriptions), fieldsPathDescriptionsSelector(state, props))
