import {
	apiRecordRequestSuccess,
} from 'root/src/client/logic/api/reducers/apiRecordRequestSuccess'

jest.mock('root/src/client/logic/api/lenses', () => {
	const { variableSchemaKey } = require('root/src/shared/util/commonLenses')
	const lensesFromSchema = require('root/src/shared/util/lensesFromSchema')
	const { prop } = require('ramda')

	const apiStoreSchema = {
		type: 'object',
		properties: {
			api: {
				type: 'object',
				properties: {
					records: {
						type: 'object',
						properties: {
							mockRecordType: {
								type: 'object',
								patternProperties: {
									[variableSchemaKey]: {
										type: 'object',
										properties: {},
									},
								},
							},
						},
					},
					recordProcessing: {
						type: 'object',
						patternProperties: {
							[variableSchemaKey]: { // recordTypes-recordId
								// type: 'boolean', this is really a boolean
								type: 'object',
								properties: {},
							},
						},
					},
				},
			},
		},
	}

	return {
		apiStoreLenses: lensesFromSchema.default(apiStoreSchema),
		idProp: prop('id'),
	}
})

describe('apiRecordRequestSuccess', () => {
	test('sets records', () => {
		const reduced = apiRecordRequestSuccess(
			{},
			{
				recordType: 'mockRecordType',
				record: { id: 'mockRecordId', data: 'mockData' },
			},
		)
		expect(reduced).toEqual({
			api: {
				records: {
					mockRecordType: {
						'mockRecordType-mockRecordId': {
							id: 'mockRecordId', data: 'mockData',
						},
					},
				},
				recordProcessing: {
					'mockRecordType-mockRecordId': false,
				},
			},
		})
	})
})
