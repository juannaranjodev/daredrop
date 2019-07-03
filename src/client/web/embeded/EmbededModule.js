import React, { memo } from 'react'

import embededModuleConnector from 'root/src/client/logic/embeded/connectors/embededModuleConnector'
import withModuleContext from 'root/src/client/util/withModuleContext'
import EmbededForm from 'root/src/client/web/embeded/embededModules/EmbededForm'

export const EmbededModuleUnconnected = memo((props) => {
	const { moduleType } = props
	switch (moduleType) {
		case 'embededForm':
			return <EmbededForm {...props} />
		default:
			return (
				<div>
					<p>embededModule: {moduleType}</p>
					<p>id: {props.moduleId}</p>
					<p>key: {props.moduleKey}</p>
				</div>
			)
	}
})

export default withModuleContext(
	embededModuleConnector(EmbededModuleUnconnected),
)
