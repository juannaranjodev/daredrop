import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'

import { variableSchemaKey } from 'root/src/shared/util/commonLenses'

export const bannerHeaderModuleDescriptionSchema = {
	type: 'object',
	patternProperties: {
		[variableSchemaKey]: {
			type: 'object',
			properties: {
				bannerImage: { type: 'string' },
				bannerSubText: { type: 'string' },
				bannerImageText: { type: 'string' },
				bannerImageSubText: { type: 'string' },
				textWithBg: { type: 'boolean' },
				createNewDareActive: { type: 'boolean' },
				link: {
					type: 'object',
					properties: {
						routeId: { type: 'string' },
						label: { type: 'string' },
					},
				},
				embededContent: {
					type: 'object',
				},
			},
		},
	},
}
export const bannerHeaderModuleDescriptionLenses = lensesFromSchema(
	bannerHeaderModuleDescriptionSchema,
)
