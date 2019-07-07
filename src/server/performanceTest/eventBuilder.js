import uuid from 'uuid/v4'

export default (event, lambdaFn, iterations, operation) => {
	const mainEvent = {
		operation,
		function: lambdaFn,
		resultsTable: process.env.PERFORMANCE_TEST_DYNAMODB_TABLE,
		testId: uuid(),
		event,
		iterations,
	}
	return mainEvent
}
