/* eslint-disable no-shadow */
import { CloudWatchEvents } from 'aws-sdk'
import { head, join, split, tail, compose } from 'ramda'

export default (endpointId, identifier) => new Promise((resolve, reject) => {
	const ruleName = join('-', [
		head(process.env.STAGE),
		endpointId,
		compose(join('-'), tail, split('-'))(identifier),
	])

	const cloudWatchEvents = new CloudWatchEvents()

	const deleteRuleParams = {
		Name: ruleName,
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
