import { reduce, prop, length } from 'ramda'
import AWS from 'aws-sdk'
import endpoints from 'root/src/server/performanceTest/endpoints'

const lambda = new AWS.Lambda()

export default (event, authentication) => reduce(async (prevEvent, endpointId) => {
	const asyncEvent = await prevEvent
	if (asyncEvent.error) {
		return { error: asyncEvent.error }
	}
	const { payload } = asyncEvent
	try {
		const endpointDesc = prop(endpointId, endpoints)
		let apiEvent = prop('actionEvent', endpointDesc)
		apiEvent.authentication = authentication
		const params = prop('parameters', endpointDesc)

		if (length(params) > 0) {
			apiEvent = reduce((eventAcc, param) => {
				const prevPayload = prop('payload', eventAcc)
				const { name, mapTo } = param
				const newPayload = { ...prevPayload, [name]: payload[mapTo] }
				return { ...apiEvent, payload: newPayload }
			}, apiEvent, params)
		}

		const lambdaParams = {
			FunctionName: endpointDesc.functionArn,
			Payload: JSON.stringify(apiEvent),
		}

		const lambdaRes = await lambda.invoke(lambdaParams).promise()
		const payloadInfo = JSON.parse(lambdaRes.Payload)

		const { statusCode } = payloadInfo

		if (statusCode >= 300 || statusCode < 200) {
			return { error: payloadInfo }
		}

		return { payload: prop('body', payloadInfo) }
	} catch (error) {
		console.log('chain')
		return Promise.resolve({ error })
	}
}, Promise.resolve({ payload: {} }), event.endpointId)
