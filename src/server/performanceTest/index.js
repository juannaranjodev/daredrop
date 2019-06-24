import { path, map, range, reduce, prop, add, length } from 'ramda'
import authenticateUser from 'root/src/server/performanceTest/authenticateUser'
import endpointsChain from 'root/src/server/performanceTest/endpointsChain'
import uuid from 'uuid/v4'
import { documentClient } from 'root/src/server/api/dynamoClient'

const integration = async (event, authentication) => {
	const timerStart = new Date().getTime()
	try {
		// here the main heavy work happens
		const { badStatusCodes, error } = await endpointsChain(event, authentication)
		const duration = new Date().getTime() - timerStart
		const iteration = add(prop('iteration', event), 1) || 0

		return {
			duration,
			iteration,
			badStatusCodes,
			error,
		}
	} catch (err) {
		console.log('integration')
		throw new Error(err)
	}
}

const integrationMulti = async (event) => {
	const authObj = {
		email: path(['credentials', 'email'], event),
		password: path(['credentials', 'password'], event),
	}
	const user = await authenticateUser(authObj)

	const authentication = path(['idToken', 'jwtToken'], user)
	const testId = uuid()
	const timerStart = new Date().getTime()
	try {
		const projects = await Promise.all(
			map(async iteration => integration({ ...event, iteration }, authentication),
				range(0, event.iterations)),
		)

		const sumDuration = reduce((acc, item) => acc + prop('duration', item), 0, projects)
		const globDuration = new Date().getTime() - timerStart

		const dDbWrites = map(({ iteration, badStatusCodes, duration, error }) => ({
			TableName: process.env.PERFORMANCE_TEST_DYNAMODB_TABLE,
			Item: {
				testId,
				iteration,
				duration,
				badStatusCodes,
				error,
			},
		}), projects)
		await Promise.all(map(pledge => documentClient.put(pledge).promise(), dDbWrites))
		return `Success! Iterations: ${event.iterations}. Test duration: ${globDuration}. Sum of lambda invocations: ${sumDuration}`
	} catch (err) {
		console.log('multi')
		throw new Error(err)
	}
}

const ops = {
	integration,
	integrationMulti,
}

export default (event, context, callback) => ops[event.operation](event).then(res => res).catch(err => callback(err))
