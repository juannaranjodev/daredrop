import cloudWatchEventsRole from 'root/src/aws/cloudWatchEvents/resources/cloudWatchEventsRole'
import cloudwatchMissingPayoutsJob from 'root/src/aws/cloudWatchEvents/resources/cloudwatchMissingPayoutsJob'

import outputs from 'root/src/aws/cloudWatchEvents/outputs'

export const cloudWatchEventsResources = {
	...cloudWatchEventsRole,
	...cloudwatchMissingPayoutsJob,
}

export const cloudWatchEventsOutputs = outputs
