import moduleDescriptions from 'root/src/shared/descriptions/modules'
import { pathOr } from 'ramda'

export default moduleId => pathOr(undefined, [moduleId, 'successPage'], moduleDescriptions)
