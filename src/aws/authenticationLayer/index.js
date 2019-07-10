/* eslint-disable import/prefer-default-export */
import authenticationLayerExecutionRole from 'root/src/aws/authenticationLayer/resources/authenticationLayerExecutionRole'
import authenticationLayerRequestHandler from 'root/src/aws/authenticationLayer/resources/authenticationLayerRequestHandler'
import authenticationLayerVersion from 'root/src/aws/authenticationLayer/resources/authenticationLayerVersion'

export const lambdaEdgeResources = {
	// lambdas
	...authenticationLayerExecutionRole,
	...authenticationLayerRequestHandler,
	// versions
	...authenticationLayerVersion,
}
