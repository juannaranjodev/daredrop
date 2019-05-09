import {
	GET_FILTERED_PROJECTS_BY_STREAMER,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { listEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'


import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'
import getFilteredProjectsByStreamerPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/getFilteredProjectsByStreamerPayloadSchema'

export const payloadSchema = getFilteredProjectsByStreamerPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[GET_FILTERED_PROJECTS_BY_STREAMER]: {
		endpointType: listEndpointType,
		recordType: project,
		payloadSchema,
		responseSchema,
	},
}
