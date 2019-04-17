import {
	GET_PENDING_VIDEOS,
} from 'root/src/shared/descriptions/endpoints/endpointIds'

import { admin } from 'root/src/shared/constants/authenticationTypes'

import { listEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { projectList } from 'root/src/shared/descriptions/endpoints/recordTypes'

import projectResponseSchema from 'root/src/shared/descriptions/endpoints/schemas/projectResponseSchema'

export const responseSchema = projectResponseSchema

export default {
	[GET_PENDING_VIDEOS]: {
		authentication: admin,
		endpointType: listEndpointType,
		recordType: projectList,
		responseSchema,
	},
}
