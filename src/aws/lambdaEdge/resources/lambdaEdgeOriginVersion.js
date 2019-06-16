import getAtt from 'root/src/aws/util/getAtt'
import { LAMBDA_EDGE_ORIGIN_VERSION, LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER } from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[LAMBDA_EDGE_ORIGIN_VERSION]: {
		Type: 'AWS::Lambda::Version',
		DependsOn: [LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER],
		Properties: {
			FunctionName: getAtt(LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER, 'Arn'),
		},
	},
}
