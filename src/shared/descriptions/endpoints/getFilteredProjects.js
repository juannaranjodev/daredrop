import {
	GET_FILTERED_PROJECTS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { listEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'


import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'
import getFilteredProjectsPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/getFilteredProjectsPayloadSchema'

export const payloadSchema = getFilteredProjectsPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[GET_FILTERED_PROJECTS]: {
		endpointType: listEndpointType,
		recordType: project,
		payloadSchema,
		responseSchema,
	},
}
