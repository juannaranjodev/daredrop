/* eslint-disable no-shadow */
import generateCrontab from 'root/src/shared/util/generateCrontab'
import { CloudWatchEvents, Lambda } from 'aws-sdk'
import { apiLongTaskFunctionArn, apiCloudWatchEventsIamRole } from 'root/cfOutput'
import { equals, prop, head, split, join, tail, compose } from 'ramda'

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
		RoleArn: apiCloudWatchEventsIamRole,
	}

	cloudWatchEvents.putRule(ruleParams, (err, rule) => {
		if (err) {
			reject(err)
		}
		const lambda = new Lambda()

		const permissionParams = {
			Action: 'lambda:InvokeFunction',
			FunctionName: apiLongTaskFunctionArn,
			Principal: 'events.amazonaws.com',
			SourceArn: rule.RuleArn,
			StatementId: `statement-${eventName}`,
		}

		lambda.addPermission(permissionParams, (err) => {
			if (err) {
				reject(err)
			}

			const targetParams = {
				Rule: eventName,
				Targets: [
					{
						Arn: apiLongTaskFunctionArn,
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
})
