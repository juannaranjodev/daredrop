import React, { memo } from 'react'
import EmbeddedFields from 'root/src/client/web/embedded/embeddedModules/EmbeddedFields'

export default memo(({ classes, ...props }) => (
	<EmbeddedFields {...props} />
))
