import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import getAtt from 'root/src/aws/util/getAtt'

import { AUTHENTICATION_LAYER_FUNCTION, AUTHENTICATION_LAYER_FUNCTION_ROLE } from 'root/src/aws/api/resourceIds'
import { Environment } from 'root/src/aws/api/resources/common/apiLambdaCommon'

export default {
	[AUTHENTICATION_LAYER_FUNCTION]: {
		Type: 'AWS::Lambda::Function',
		Properties: {
			Code: fnBuildPath('authenticationLayer'),
			Environment,
			// FunctionName: String,
			Role: getAtt(AUTHENTICATION_LAYER_FUNCTION_ROLE, 'Arn'),
			// Handler: 'index.default',
			MemorySize: 1024,
			Runtime: 'nodejs8.10',
			Timeout: 10,
		},
	},
}
