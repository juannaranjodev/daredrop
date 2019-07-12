/* eslint-disable import/prefer-default-export */
import lambdaEdgeExecutionRole from 'root/src/aws/lambdaEdge/resources/lambdaEdgeExecutionRole'
import lambdaEdgeOriginRequestHandler from 'root/src/aws/lambdaEdge/resources/lambdaEdgeOriginRequestHandler'
import lambdaEdgeViewerRequestHandler from 'root/src/aws/lambdaEdge/resources/lambdaEdgeViewerRequestHandler'
import lambdaEdgeOriginVersion from 'root/src/aws/lambdaEdge/resources/lambdaEdgeOriginVersion'
import lambdaEdgeViewerVersion from 'root/src/aws/lambdaEdge/resources/lambdaEdgeViewerVersion'
import { isProdEnv } from 'root/src/aws/util/envSelect'

const prodResources = {
	// lambdas
	...lambdaEdgeOriginRequestHandler,
	...lambdaEdgeViewerRequestHandler,
	// versions
	...lambdaEdgeOriginVersion,
	...lambdaEdgeViewerVersion,
}

export const lambdaEdgeResources = {
	// leaving role in common resources as it will be the same for dev and for prod
	...lambdaEdgeExecutionRole,
	...(isProdEnv ? prodResources : {}),
}
