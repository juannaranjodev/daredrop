import { path, map, range, reduce, prop, add } from 'ramda'
import authenticateUser from 'root/src/server/performanceTest/authenticateUser'
import endpointsChain from 'root/src/server/performanceTest/endpointsChain'
import uuid from 'uuid/v4'
import { documentClient } from 'root/src/server/api/dynamoClient'
import outputs from 'root/cfOutput'
import getLambdaConfigurations from 'root/src/server/performanceTest/getLambdaConfigurations'
import setLambdaStage from 'root/src/server/performanceTest/setLambdaStage'
import wait from 'root/src/testUtil/wait'

const { apiLongTaskFunctionArn, apiFunctionArn } = outputs

const integration = async (event, authentication) => {
	const timerStart = new Date().getTime()
	try {
		// here the main heavy work happens
		const { error } = await endpointsChain(event, authentication)
		const duration = new Date().getTime() - timerStart
		const iteration = add(prop('iteration', event), 1) || 0

		return {
			duration,
			iteration,
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
			map(async (iteration) => {
				await wait(iteration * event.waitTime)
				return integration({ ...event, iteration }, authentication)
			},
			range(0, event.iterations)),
		)
		const sumDuration = reduce((acc, item) => acc + prop('duration', item), 0, projects)
		const globDuration = new Date().getTime() - timerStart

		const dDbWrites = map(({ iteration, duration, error }) => ({
			TableName: process.env.PERFORMANCE_TEST_DYNAMODB_TABLE,
			Item: {
				testId,
				iteration,
				duration,
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

export default async (event, context, callback) => {
	const functionNames = [apiLongTaskFunctionArn, apiFunctionArn]
	const configurations = await getLambdaConfigurations(functionNames)
	try {
		await setLambdaStage(configurations, 'testing')
		return ops[event.operation](event).then(async (res) => {
			await setLambdaStage(configurations, 'dev')
			return res
		}).catch(async (err) => {
			await setLambdaStage(configurations, 'dev')
			return callback(err)
		})
	} catch (err) {
		await setLambdaStage(configurations, 'dev')
	}
}
