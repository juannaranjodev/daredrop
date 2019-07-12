import { prop, pick } from 'ramda'

import validateSchema from 'root/src/shared/util/validateSchema'
import {
	customError, payloadSchemaError, responseSchemaError,
	notFoundError,
} from 'root/src/server/api/errors'
import ajvErrors from 'root/src/shared/util/ajvErrors'
import {
	getPayloadSchema, getResultSchema, testEndpointExists,
} from 'root/src/shared/descriptions/getEndpointDesc'
import cloudWatchJobs from 'root/src/server/cloudWatchEvents/actions'
import triggerActions from 'root/src/server/email/actions'

const validateOrNah = (schemaType, endpointId, schema) => (payload) => {
	if (schema) {
		return validateSchema(
			`${endpointId}${schemaType}`, schema, payload,
		).then((res) => {
			if (prop('valid', res)) {
				return payload
			}
			const errors = ajvErrors(schema, prop('errors', res))
			const errorType = schemaType === 'payloadSchema'
				? payloadSchemaError(errors) : responseSchemaError(errors)
			throw errorType
		})
	}
	return Promise.resolve(payload)
}

export const apiHof = (
	cloudWatchJobsObj, getPayloadSchemaFn, getResultSchemaFn,
	getTriggerActionsObj, testEndpointExistsFn,
) => async (event) => {
	const { endpointId, payload } = event
	try {
		const endpointExists = testEndpointExistsFn(endpointId)
		if (!endpointExists) {
			throw notFoundError(endpointId)
		}
		const action = prop(endpointId, cloudWatchJobsObj)

		const payloadSchema = getPayloadSchemaFn(endpointId)
		const resultSchema = getResultSchemaFn(endpointId)
		const validatePayload = validateOrNah(
			'payloadSchema', endpointId, payloadSchema,
		)
		const validateResult = validateOrNah(
			'resultSchema', endpointId, resultSchema,
		)

		await validatePayload(payload)
		const res = await action({ payload })
		await validateResult(res)

		return { statusCode: 200, body: res }
	} catch (error) {
		const errorMessage = error.message
		return customError(error.statusCode || 500, {
			...(errorMessage ? { generalErrors: errorMessage } : {}),
			...pick(['generalErrors', 'schemaErrors'], error),
		})
	}
}

export const apiFn = apiHof(
	cloudWatchJobs, getPayloadSchema, getResultSchema,
	triggerActions, testEndpointExists,
)

// can't return promise?
export default (event, context, callback) => {
	apiFn(event, context, callback).then((res) => {
		callback(null, res)
	})
}
