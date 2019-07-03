import React, { memo } from 'react'
import EmbededFields from 'root/src/client/web/embeded/embededModules/EmbededFields'

export default memo(({ classes, ...props }) => (
	<EmbededFields {...props} />
))
