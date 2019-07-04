import moduleDescriptions from 'root/src/shared/descriptions/modules'

import {
	bannerHeaderModuleDescriptionLenses,
} from 'root/src/client/logic/header/lenses'

const { viewEmbeddedContent } = bannerHeaderModuleDescriptionLenses

export default (state, { moduleId }) => viewEmbeddedContent(
	moduleId, moduleDescriptions,
)
