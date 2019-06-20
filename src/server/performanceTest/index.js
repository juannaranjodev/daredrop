/* eslint-disable no-await-in-loop */
/* eslint-disable import/prefer-default-export */

/**
 * Provides a simple framework for conducting various tests of your Lambda
 * functions. Make sure to include permissions for `lambda:InvokeFunction`
 * and `dynamodb:PutItem` in your execution role!
 */
const AWS = require('aws-sdk')
const doc = require('dynamodb-doc')

const lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })
const dynamo = new doc.DynamoDB()


/**
 * Will invoke the given function and write its result to the DynamoDB table
 * `event.resultsTable`. This table must have a hash key string of "testId"
 * and range key number of "iteration". Specify a unique `event.testId` to
 * differentiate each unit test run.
 */
const unit = async (event) => {
	const lambdaParams = {
		FunctionName: event.function,
		Payload: JSON.stringify(event.event),
	}
	const data = await lambda.invoke(lambdaParams).promise()
	// Write result to Dynamo
	const dynamoParams = {
		TableName: event.resultsTable,
		Item: {
			testId: event.testId,
			iteration: event.iteration || 0,
			result: data.Payload,
			passed: !Object.prototype.hasOwnProperty.call(JSON.parse(data.Payload), 'errorMessage'),
		},
	}
	return dynamo.putItem(dynamoParams).promise()
}

/**
 * Will invoke the given function asynchronously `event.iterations` times.
 */
const load = async (event) => {
	const payload = event.event
	for (let i = 0; i < event.iterations; i++) {
		payload.iteration = i
		await lambda.invoke({
			FunctionName: event.function,
			InvocationType: 'Event',
			Payload: JSON.stringify(payload),
		}).promise()
	}
	return 'Load test complete'
}


const ops = {
	unit,
	load,
}

/**
 * Pass the test type (currently either "unit" or "load") as `event.operation`,
 * the name of the Lambda function to test as `event.function`, and the event
 * to invoke this function with as `event.event`.
 *
 * See the individual test methods above for more information about each
 * test type.
 */
export const handler = async (event, context) => {
	if (Object.prototype.hasOwnProperty.call(ops, event.operation)) {
		return ops[event.operation](event)
	}
	throw new Error(`Unrecognized operation "${event.operation}"`)
}
