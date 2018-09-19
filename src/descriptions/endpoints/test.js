import {
	TEST_ENDPOINT_ID,
} from 'sls-aws/src/descriptions/endpoints/endpointIds'


export default {
	[TEST_ENDPOINT_ID]: {
		authentication: '',
		action: payload => Promise.resolve(`${payload.test} success`),
		// toRepresentation: toRepresentation('modelSchema'),
		// toInternalValue: toInternalValue('modelSchema'),
		payloadSchema: {
			type: 'object',
			properties: {
				test: { type: 'string' },
			},
		},
		// responseSchema: {
		// 	type: 'object',
		// 	properties: {},
		// },
	},
	// [UPDATE_TEST_ENDPOINT_ID]: {
	// 	authentication: '',
	// 	action: updateRecord('model'),
	// 	toRepresentation: toRepresentation('modelSchema'),
	// 	toInternalValue: toInternalValue('modelSchema'),
	// 	payloadSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// 	responseSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// },
	// [READ_TEST_ENDPOINT_ID]: {
	// 	authentication: '',
	// 	action: readRecord('model'),
	// 	toRepresentation: toRepresentation('modelSchema'),
	// 	toInternalValue: toInternalValue('modelSchema'),
	// 	payloadSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// 	responseSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// },
	// [DELETE_TEST_ENDPOINT_ID]: {
	// 	authentication: '',
	// 	action: deleteRecord('model'),
	// 	toRepresentation: toRepresentation('modelSchema'),
	// 	toInternalValue: toInternalValue('modelSchema'),
	// 	payloadSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// 	responseSchema: {
	// 		type: 'object',
	// 		properties: {},
	// 	},
	// },
}