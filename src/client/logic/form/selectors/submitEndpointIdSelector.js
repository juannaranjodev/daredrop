import moduleDescriptions from 'root/src/shared/descriptions/modules'
import { pathOr } from 'ramda'

export default (moduleId, submitIndex) => pathOr(undefined,
	[moduleId, 'submits', submitIndex, 'endpointId'],
	moduleDescriptions)
