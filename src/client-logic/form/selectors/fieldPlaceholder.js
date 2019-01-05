import { pathOr } from 'ramda'

import moduleDescriptions from 'sls-aws/src/descriptions/modules'
import moduleIdFromKey from 'sls-aws/src/client-logic/route/util/moduleIdFromKey'

export default (state, { moduleKey, fieldDescPath }) => pathOr(
	'',
	[moduleIdFromKey(moduleKey), 'fields', ...fieldDescPath, 'placeholder'],
	moduleDescriptions,
)