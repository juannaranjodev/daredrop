import { GET_ACCEPTED_PROJECTS } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { listEndpointType } from 'root/src/shared/descriptions/endpoints/lenses'
import { projectAccepted } from 'root/src/shared/descriptions/endpoints/recordTypes'

export default {
	[GET_ACCEPTED_PROJECTS]: {
		endpointType: listEndpointType,
		recordType: projectAccepted,
	},
}
