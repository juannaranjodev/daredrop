import {
	GET_FILTERED_PROJECTS_BY_GAME,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { listEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'


import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'
import getFilteredProjectsByGamePayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/getFilteredProjectsByGamePayloadSchema'

export const payloadSchema = getFilteredProjectsByGamePayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[GET_FILTERED_PROJECTS_BY_GAME]: {
		endpointType: listEndpointType,
		recordType: project,
		payloadSchema,
		responseSchema,
	},
}
