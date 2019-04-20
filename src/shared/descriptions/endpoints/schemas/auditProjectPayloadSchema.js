import {
	projectApprovedKey, projectRejectedKey, projectVideoAcceptedKey, projectVideoRejectedKey,
} from 'root/src/server/api/lenses'

export default {
	type: 'object',
	properties: {
		projectId: { type: 'string' },
		audit: {
			type: 'string',
			enum: [
				projectApprovedKey,
				projectRejectedKey,
				projectVideoAcceptedKey,
				projectVideoRejectedKey,
			],
		},
	},
	required: ['projectId', 'audit'],
	additionalProperties: false,
}
