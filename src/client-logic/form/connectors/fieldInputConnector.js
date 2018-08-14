import reduxConnector from 'sls-aws/src/util/reduxConnector'

import fieldValue from 'sls-aws/src/client-logic/form/selectors/fieldValue'
import fieldLabel from 'sls-aws/src/client-logic/form/selectors/fieldLabel'
import fieldError from 'sls-aws/src/client-logic/form/selectors/fieldError'
import fieldHasError from 'sls-aws/src/client-logic/form/selectors/fieldHasError'

import setInput from 'sls-aws/src/client-logic/form/thunks/setInput'

export default reduxConnector(
	[
		['fieldValue', fieldValue],
		['fieldLabel', fieldLabel],
		['fieldError', fieldError],
		['fieldHasError', fieldHasError],
	],
	[['setInput', setInput]]
)