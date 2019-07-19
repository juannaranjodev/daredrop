import { UPLOAD_MISSING_VIDEOS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import cronJobPayloadSchema from 'root/src/shared/descriptions/endpoints/schemas/cronJobPayloadSchema'

export const payloadSchema = cronJobPayloadSchema

export default {
	[UPLOAD_MISSING_VIDEOS]: {
		payloadSchema,
	},
}
