import resourcePrefix from 'root/src/aws/util/resourcePrefix'

export const LAMBDA_EDGE_EXECUTION_ROLE = `${resourcePrefix}LambdaEdgeExecutionRole`
export const LAMBDA_VERSION_EXECUTION_ROLE = `${resourcePrefix}LambdaVersionExecutionRole`

export const LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER = `${resourcePrefix}LambdaEdgeOriginRequestHandler`
export const LAMBDA_EDGE_ORIGIN_VERSION = `${resourcePrefix}LambdaEdgeOriginVersion`

export const LAMBDA_EDGE_VIEWER_REQUEST_HANDLER = `${resourcePrefix}LambdaEdgeViewerRequestHandler`
export const LAMBDA_EDGE_VIEWER_VERSION = `${resourcePrefix}LambdaEdgeViewerVersion`
