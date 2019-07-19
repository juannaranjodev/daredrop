// import {
// 	projectApprovedKey, projectRejectedKey,
// } from 'root/src/shared/descriptions/apiLenses'

export default {
	type: 'object',
	properties: {
		authToken: { type: 'string' },
	},
	required: ['authToken'],
	additionalProperties: false,
}
