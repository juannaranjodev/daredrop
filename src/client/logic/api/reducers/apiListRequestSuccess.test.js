import {
	apiListRequestSuccess,
} from 'root/src/client/logic/api/reducers/apiListRequestSuccess'

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
					lists: {
						type: 'object',
						patternProperties: {
							[variableSchemaKey]: { // listStoreKey
								type: 'object',
								properties: {
									next: { type: 'string' },
									items: { type: 'array' },
								},
							},
						},
					},
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
					listProcessing: {
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
		itemsProp: prop('items'),
		projectIdProp: prop('projectId'),
		nextKeyProp: prop('next'),
	}
})

describe('apiListRequestSuccess', () => {
	test('sets list ids and records', () => {
		const reduced = apiListRequestSuccess(
			{},
			{
				listStoreKey: 'mockListStoreKey',
				recordType: 'mockRecordType',
				list: {
					next: 'mockNextPageKey',
					items: [
						{ id: 'mockId1', data: 'mockData' },
						{ id: 'mockId2', data: 'mockData' },
					],
				},
			},
		)
		expect(reduced).toEqual({
			api: {
				lists: {
					mockListStoreKey: {
						next: 'mockNextPageKey',
						items: [
							'mockId1',
							'mockId2',
						],
					},
				},
				listProcessing: {
					mockListStoreKey: false,
				},
				records: {
					mockRecordType: {
						'mockRecordType-mockId1': {
							id: 'mockId1',
							data: 'mockData',
						},
						'mockRecordType-mockId2': {
							id: 'mockId2',
							data: 'mockData',
						},
					},
				},
			},
		})
	})
})
