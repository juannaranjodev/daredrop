import lensesFromSchema from 'root/src/shared/util/lensesFromSchema'

  import { variableSchemaKey } from 'root/src/shared/util/commonLenses'

  const modalSchema = {
	type: 'object',
	properties: {
		app: {
			type: 'object',
			patternProperties: {
				[variableSchemaKey]: {
					type: 'object',
					properties: {
						modalVisible: {
							type: 'boolean',
						},
					},
				},
			},
		},
	},
}

  export const modalStoreLenses = lensesFromSchema(modalSchema) 