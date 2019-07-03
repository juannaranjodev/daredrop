import reduxConnector from 'root/src/shared/util/reduxConnector'

import fieldValueSelector from 'root/src/client/logic/embeded/selectors/fieldValueSelector'
import allFieldsValuesSelector from 'root/src/client/logic/embeded/selectors/allFieldsValuesSelector'
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
		['allFieldsValues', allFieldsValuesSelector],
		['fieldValue', fieldValueSelector],
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
