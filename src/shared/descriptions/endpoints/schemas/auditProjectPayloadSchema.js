import {
	projectApprovedKey, projectRejectedKey,
} from 'root/src/shared/descriptions/apiLenses'

export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		audit: {
			type: 'string',
			enum: [
				projectApprovedKey,
				projectRejectedKey,
			],
		},
	},
	required: ['projectId', 'audit'],
	additionalProperties: false,
}
