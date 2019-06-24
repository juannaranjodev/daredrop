/* eslint-disable no-shadow */
import { CloudWatchEvents, Lambda } from 'aws-sdk'
import { apiLongTaskFunctionArn } from 'root/cfOutput'

export default (endpointId, identifier) => new Promise((resolve, reject) => {
	const ruleName = `${endpointId}-${identifier}`

	const cloudWatchEvents = new CloudWatchEvents()

	const deleteRuleParams = {
		Name: ruleName,
	}
	const lambda = new Lambda()

	const lambdaPermission = {
		FunctionName: apiLongTaskFunctionArn,
		StatementId: `statement-${ruleName}`,
	}

	lambda.removePermission(lambdaPermission, (err) => {
		if (err) {
			reject(err)
		}

		const targetParams = {
			Ids: ['cloudWatchTarget'],
			Rule: ruleName,
		}

		cloudWatchEvents.removeTargets(targetParams, (err) => {
			if (err) {
				reject(err)
			}

			cloudWatchEvents.deleteRule(deleteRuleParams, (err) => {
				if (err) {
					reject(err)
				}
				resolve()
			})
		})
	})
})
