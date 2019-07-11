import cloudWatchEventsRole from 'root/src/aws/cloudWatchEvents/resources/cloudWatchEventsRole'
import cloudwatchMissingPayoutsJob from 'root/src/aws/cloudWatchEvents/resources/cloudwatchMissingPayoutsJob'
import cloudwatchMissingVideosJob from 'root/src/aws/cloudWatchEvents/resources/cloudwatchMissingVideosJob'

import outputs from 'root/src/aws/cloudWatchEvents/outputs'

export const cloudWatchEventsResources = {
	...cloudWatchEventsRole,
	...cloudwatchMissingPayoutsJob,
	...cloudwatchMissingVideosJob,
}

export const cloudWatchEventsOutputs = outputs
