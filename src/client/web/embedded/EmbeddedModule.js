import React, { memo } from 'react'

import embeddedModuleConnector from 'root/src/client/logic/embedded/connectors/embeddedModuleConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import EmbeddedForm from 'root/src/client/web/embedded/embeddedModules/EmbeddedForm'

export const EmbeddedModuleUnconnected = memo((props) => {
	const { moduleType } = props
	switch (moduleType) {
		case 'embeddedForm':
			return <EmbeddedForm {...props} />
		default:
			return (
				<div>
					<p>embeddedModule: {moduleType}</p>
					<p>id: {props.moduleId}</p>
					<p>key: {props.moduleKey}</p>
				</div>
			)
	}
})

export default withModuleContext(
	embeddedModuleConnector(EmbeddedModuleUnconnected),
)
