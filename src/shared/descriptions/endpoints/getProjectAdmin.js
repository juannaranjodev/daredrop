import {
	GET_PROJECT_ADMIN,
} from 'root/src/shared/descriptions/endpoints/endpointIds'
import { admin } from 'root/src/shared/constants/authenticationTypes'

import { recordEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { project } from 'root/src/shared/descriptions/endpoints/recordTypes'

import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'
import getProjectPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/getProjectPayloadSchema'

export const payloadSchema = getProjectPayloadSchema
export const responseSchema = projectResponseSchema

export default {
	[GET_PROJECT_ADMIN]: {
		authentication: admin,
		endpointType: recordEndpointType,
		recordType: project,
		payloadSchema,
		responseSchema,
	},
}
