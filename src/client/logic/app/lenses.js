import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'
import { variableSchemaKey } from 'root/src/shared/util/commonLenses'

const appSchema = {
	type: 'object',
	properties: {
		app: {
			type: 'object',
			properties: {
				authenticated: {
					type: 'object',
					properties: {
						idToken: {
							type: 'object',
							properties: {
								jwtToken: { type: 'string' },
								payload: {
									type: 'object',
									properties: {
										'cognito:groups': {
											type: 'array',
											items: { type: 'string' },
										},
									},
								},
							},
						},
					},
				},
				mediaBreakpoints: {
					type: 'object',
					properties: {
						xs: { type: 'boolean' },
						gtXs: { type: 'boolean' },
						sm: { type: 'boolean' },
						gtSm: { type: 'boolean' },
						md: { type: 'boolean' },
						gtMd: { type: 'boolean' },
						lg: { type: 'boolean' },
						gtLg: { type: 'boolean' },
						xl: { type: 'boolean' },
					},
				},
				uploadProgress: {
					type: 'object',
					patternProperties: {
						[variableSchemaKey]: {
							type: 'object',
							properties: {
								currentProgress: { type: 'integer' },
								targetProgress: { type: 'integer' },
							},
						},
					},
				},
			},
		},
	},
}

export const appStoreLenses = lensesFromSchema(appSchema)
