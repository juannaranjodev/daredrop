import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import getAtt from 'root/src/aws/util/getAtt'

import { API_LAMBDA_FUNCTION, API_LAMBDA_EXECUTION_ROLE } from 'root/src/aws/api/resourceIds'
import { DependsOn, Environment } from 'root/src/aws/api/resources/common/apiLambdaCommon'

export default {
	[API_LAMBDA_FUNCTION]: {
		Type: 'AWS::Lambda::Function',
		DependsOn,
		Properties: {
			Code: fnBuildPath('authenticationLayer'),
			Environment,
			// FunctionName: String,
			Role: getAtt(API_LAMBDA_EXECUTION_ROLE, 'Arn'),
			// Handler: 'index.default',
			MemorySize: 1024,
			Runtime: 'nodejs8.10',
			Timeout: 10,
		},
	},
}
