import React, { memo, useState, useEffect } from 'react'
import Fields from 'root/src/client/web/form/Fields'
import withModuleContext from 'root/src/client/util/withModuleContext'
import payoutItemConnector from 'root/src/client/logic/payoutMethod/connectors/payoutItemConnector'


const PayoutField = memo(({
	moduleKey, moduleId, formFieldTypes, formType, wasSubmitted, email, setInput,
}) => {
	useEffect(() => {
		setInput(moduleKey, ['email'], email)
	}, [email])

	return (
		<Fields
			moduleKey={moduleKey}
			moduleId={moduleId}
			formFieldTypes={formFieldTypes}
			formType={formType}
			wasSubmitted={wasSubmitted}
		/>
	)
})

export default withModuleContext(
	payoutItemConnector(PayoutField, {}),
)
