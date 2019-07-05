import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'

import { variableSchemaKey } from 'root/src/shared/util/commonLenses'

export const embeddedModuleLenses = {
	type: 'object',
	properties: {
		embedded: {
			type: 'object',
			patternProperties: {
				[variableSchemaKey]: {
					type: 'object',
					properties: {
						fieldData: {
							type: 'array',
							items: {
								type: 'object',
								properties: {},
							},
						},
					},
				},
			},
		},
	},
}

export const embeddedStoreLenses = lensesFromSchema(
	embeddedModuleLenses,
)
