import { prop, pick, path, not, equals } from 'ramda'
import { ternary } from 'root/src/shared/util/ramdaPlus'

import validateSchema from 'root/src/shared/util/validateSchema'
import {
	customError, payloadSchemaError, responseSchemaError,
	notFoundError, authorizationError,
} from 'root/src/server/api/errors'
import ajvErrors from 'root/src/shared/util/ajvErrors'
import {
	getPayloadSchema, getResultSchema, testEndpointExists, getIsLongRunningTask, getIsInvokedInternal,
} from 'root/src/server/api/getEndpointDesc'
import serverEndpoints from 'root/src/server/api/actions'
import authorizeRequest from 'root/src/server/api/authorizeRequest'
import triggerActions from 'root/src/server/email/actions'
import keyProtectedClient from 'root/src/server/api/keyProtectedClient'

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

const validateSecretKey = ({ apiKey, secretKey, endpointId }) => {
	if (not(equals(apiKey, secretKey))) {
		throw authorizationError(`Unauthorized request to ${endpointId}`)
	}
}

export const apiHof = (
	serverEndpointsObj, getPayloadSchemaFn, getResultSchemaFn, getTriggerActionsObj,
	authorizeRequestFn, testEndpointExistsFn, isLongRunningTask, isInvokedInternal,
) => async (event) => {
	try {
		const { endpointId, payload, authentication, triggerSource, apiKey } = event

		if (isInvokedInternal(endpointId)) {
			const { secretKey } = await keyProtectedClient
			const requestData = {
				apiKey,
				secretKey,
				endpointId,
			}
			validateSecretKey(requestData)
		}

		const endpointExists = testEndpointExistsFn(endpointId)
		if (triggerSource) {
			const triggerAction = path([triggerSource], getTriggerActionsObj)
			const { request } = event
			const res = await triggerAction(request)
			return { statusCode: 200, body: res }
		}
		if (!endpointExists) {
			throw notFoundError(endpointId)
		}
		const action = ternary(isLongRunningTask(endpointId),
			path(['longRunningTask', endpointId], serverEndpointsObj),
			path(['shortRunningTask', endpointId], serverEndpointsObj))

		const payloadSchema = getPayloadSchemaFn(endpointId)
		const resultSchema = getResultSchemaFn(endpointId)
		const userId = await authorizeRequestFn(endpointId, authentication)
		const validatePayload = validateOrNah(
			'payloadSchema', endpointId, payloadSchema,
		)
		const validateResult = validateOrNah(
			'resultSchema', endpointId, resultSchema,
		)

		await validatePayload(payload)
		const res = await action({ userId, payload })

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
	serverEndpoints, getPayloadSchema, getResultSchema, triggerActions,
	authorizeRequest, testEndpointExists, getIsLongRunningTask, getIsInvokedInternal,
)

// can't return promise?
export default (event, context, callback) => {
	apiFn(event, context, callback).then((res) => {
		callback(null, res)
	})
}
