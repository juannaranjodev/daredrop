import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import getAtt from 'root/src/aws/util/getAtt'

import { AUTHENTICATION_LAYER_EXECUTION_ROLE, AUTHENTICATION_LAYER_REQUEST_HANDLER } from 'root/src/aws/authenticationLayer/resourceIds'

export default {
	[AUTHENTICATION_LAYER_REQUEST_HANDLER]: {
		Type: 'AWS::Lambda::Function',
		DependsOn: [AUTHENTICATION_LAYER_EXECUTION_ROLE],
		Properties: {
			Code: fnBuildPath('authenticationLayer'),
			Role: getAtt(AUTHENTICATION_LAYER_EXECUTION_ROLE, 'Arn'),
			MemorySize: 128,
			Runtime: 'nodejs8.10',
			Timeout: 2,
		},
	},
}
