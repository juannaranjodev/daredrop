/* eslint-disable no-shadow */
import generateCrontab from 'root/src/shared/util/generateCrontab'
import { CloudWatchEvents } from 'aws-sdk'
import outputs from 'root/cfOutput'
import { equals, prop, head, split, join, tail, compose } from 'ramda'

const { apiCloudwatchFunctionArn, cloudWatchEventsIamRole } = outputs

export default (eventInput, cronTime, identifier) => new Promise((resolve, reject) => {
	const ruleId = compose(join('-'), tail, split('-'))(eventInput.payload[identifier])

	// this one has to be max 64 characters
	const eventName = `${head(process.env.STAGE)}-${eventInput.endpointId}-${ruleId}`
	const crontab = generateCrontab(cronTime)

	const cloudWatchEvents = new CloudWatchEvents()

	const ruleParams = {
		Name: eventName,
		ScheduleExpression: crontab,
		State: 'ENABLED',
		RoleArn: cloudWatchEventsIamRole,
	}

	cloudWatchEvents.putRule(ruleParams, (err, rule) => {
		if (err) {
			reject(err)
		}

		const targetParams = {
			Rule: eventName,
			Targets: [
				{
					Arn: apiCloudwatchFunctionArn,
					Id: 'cloudWatchTarget',
					Input: JSON.stringify(eventInput),
				},
			],
		}

		cloudWatchEvents.putTargets(targetParams, (err, data) => {
			if (err) {
				reject(err)
			} else if (equals(prop('FailedEntryCount', data), 0)) {
				resolve()
			}
			reject(new Error({
				message: 'Setting cron job error',
				data: prop('FailedEntries', data),
			}))
		})
	})
})
