import { all, prop, path } from 'ramda'

import clientEndpoints from 'root/src/shared/descriptions/endpoints'

export const testEndpointExists = endpointId => all([
	prop(endpointId, clientEndpoints),
])

export const getPayloadLenses = endpointId => path(
	[endpointId, 'payloadLenses'],
	clientEndpoints,
)

export const getResponseLenses = endpointId => path(
	[endpointId, 'responseLenses'],
	clientEndpoints,
)

export const getPayloadSchema = (endpointId) => {
	if (process.env.STAGE === 'testing') {
		return path(
			[endpointId, 'testingPayloadSchema'],
			clientEndpoints,
		)
	}
	return path(
		[endpointId, 'payloadSchema'],
		clientEndpoints,
	)
}

export const getResultSchema = endpointId => path(
	[endpointId, 'resultSchema'],
	clientEndpoints,
)

export const getAuthentication = endpointId => path(
	[endpointId, 'authentication'],
	clientEndpoints,
)

export const getIsLongRunningTask = endpointId => path(
	[endpointId, 'isLongRunningTask'],
	clientEndpoints,
)

export const getIsInvokedInternal = endpointId => path(
	[endpointId, 'isInvokedInternal'],
	clientEndpoints,
)

export const getAction = endpointId => prop(endpointId, serverEndpoints)
