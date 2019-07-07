import getAtt from 'root/src/aws/util/getAtt'
import {
	LAMBDA_EDGE_VIEWER_VERSION, LAMBDA_EDGE_VIEWER_REQUEST_HANDLER,
} from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[LAMBDA_EDGE_VIEWER_VERSION]: {
		Type: 'AWS::Lambda::Version',
		DependsOn: [LAMBDA_EDGE_VIEWER_REQUEST_HANDLER],
		Properties: {
			FunctionName: getAtt(LAMBDA_EDGE_VIEWER_REQUEST_HANDLER, 'Arn'),
		},
	},
}
