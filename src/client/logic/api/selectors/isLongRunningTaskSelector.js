import endpointDescriptions from 'root/src/shared/descriptions/endpoints'
import {
	endpointDescriptionLenses,
} from 'root/src/shared/descriptions/endpoints/lenses'

const { viewIsLongRunningTask } = endpointDescriptionLenses

const endpointLongTaskRunningFn = endpointDescriptionsObj => endpointId => viewIsLongRunningTask(endpointId, endpointDescriptionsObj)

export default endpointLongTaskRunningFn(endpointDescriptions)
