import moduleDescriptions from 'root/src/shared/descriptions/modules'

import {
	bannerHeaderModuleDescriptionLenses,
} from 'root/src/client/logic/header/lenses'

const { viewEmbededContent } = bannerHeaderModuleDescriptionLenses

export default (state, { moduleId }) => viewEmbededContent(
	moduleId, moduleDescriptions,
)
