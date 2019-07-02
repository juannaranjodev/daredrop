import reduxConnector from 'root/src/shared/util/reduxConnector'

import fieldsValueSelector from 'root/src/client/logic/embeded/selectors/fieldsValueSelector'
import fieldsSelector from 'root/src/client/logic/embeded/selectors/fieldsSelector'
import fieldsDefaultSelector from 'root/src/client/logic/embeded/selectors/fieldsDefaultSelector'
import fieldsPathDescriptionsSelector from 'root/src/client/logic/embeded/selectors/fieldsPathDescriptionsSelector'
import fieldsPathSelector from 'root/src/client/logic/embeded/selectors/fieldsPathSelctor'
import fieldsOptionsSelector from 'root/src/client/logic/embeded/selectors/fieldsOptionsSelector'
import fieldsLoadOptionsPromiseSelector from 'root/src/client/logic/embeded/selectors/fieldsLoadOptionsPromiseSelector'
import endpointSelector from 'root/src/client/logic/embeded/selectors/endpointSelector'
import setInputAsync from 'root/src/client/logic/embeded/thunks/setInputAsync'
import fieldsPlaceholderSelector from 'root/src/client/logic/embeded/selectors/fieldsPlaceholderSelector'

export default reduxConnector(
	[
		['fields', fieldsSelector],
		['fieldsValue', fieldsValueSelector],
		['fieldsDefault', fieldsDefaultSelector],
		['fieldsLoadOptionsPromise', fieldsLoadOptionsPromiseSelector],
		['fieldsPathDescriptions', fieldsPathDescriptionsSelector],
		['fieldPath', fieldsPathSelector],
		['fieldsOptions', fieldsOptionsSelector],
		['endpointId', endpointSelector],
		['fieldsPlaceholder', fieldsPlaceholderSelector],
	],
	[
		['setInput', setInputAsync],
	],
)
