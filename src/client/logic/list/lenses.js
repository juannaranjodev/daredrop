import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'

import { variableSchemaKey } from 'root/src/shared/util/commonLenses'

const listSchema = {
	type: 'object',
	properties: {
		list: {
			type: 'object',
			properties: {
				currentPage: { type: 'integer' },
				hasMore: { type: 'boolean' },
				filterParams: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							param: { type: 'string' },
							value: { type: 'string' },
						},
					},
				},
				sortValue: {
					type: 'object',
					properties: {
						label: { type: 'string' },
						id: { type: 'string' },
						value: { type: 'string' },
					},
				},
				gameFilterValue: { type: 'string' },
				streamerFilterValue: { type: 'string' },
				sortType: { type: 'string' },
			},
		},
	},
}

export const listStoreLenses = lensesFromSchema(listSchema)

export const listModuleSchema = {
	type: 'object',
	patternProperties: {
		[variableSchemaKey]: {
			type: 'object',
			properties: {
				listType: { type: 'string', enum: ['card', 'list'] },
				listTitle: { type: 'string' },
				listSubtitle: { type: 'string' },
				listControls: { type: 'array' },
				listSubmits: { type: 'array' },
				listRouteHandler: { type: 'function' },
			},
		},
	},
}
export const listModuleLenses = lensesFromSchema(listModuleSchema)
