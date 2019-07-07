/* eslint-disable import/prefer-default-export */
import lambdaEdgeExecutionRole from 'root/src/aws/lambdaEdge/resources/lambdaEdgeExecutionRole'
import lambdaEdgeOriginRequestHandler from 'root/src/aws/lambdaEdge/resources/lambdaEdgeOriginRequestHandler'
import lambdaEdgeViewerRequestHandler from 'root/src/aws/lambdaEdge/resources/lambdaEdgeViewerRequestHandler'
import lambdaEdgeOriginVersion from 'root/src/aws/lambdaEdge/resources/lambdaEdgeOriginVersion'
import lambdaEdgeViewerVersion from 'root/src/aws/lambdaEdge/resources/lambdaEdgeViewerVersion'

export const lambdaEdgeResources = {
	// lambdas
	...lambdaEdgeExecutionRole,
	...lambdaEdgeOriginRequestHandler,
	...lambdaEdgeViewerRequestHandler,
	// versions
	...lambdaEdgeOriginVersion,
	...lambdaEdgeViewerVersion,
}
