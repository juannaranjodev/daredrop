import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import getAtt from 'root/src/aws/util/getAtt'

import { LAMBDA_EDGE_EXECUTION_ROLE, LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER } from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER]: {
		Type: 'AWS::Lambda::Function',
		DependsOn: [LAMBDA_EDGE_EXECUTION_ROLE],
		Properties: {
			Code: fnBuildPath('edge/origin'),
			Role: getAtt(LAMBDA_EDGE_EXECUTION_ROLE, 'Arn'),
			MemorySize: 128,
			Runtime: 'nodejs8.10',
			Timeout: 2,
		},
	},
}
