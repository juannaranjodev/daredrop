import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import ref from 'root/src/aws/util/ref'
import getAtt from 'root/src/aws/util/getAtt'

import {
	PERFORMANCE_TEST_LAMBDA, PERFORMANCE_TEST_LAMBDA_EXECUTION_ROLE, PERFORMANCE_TEST_DYNAMODB_TABLE,
} from 'root/src/aws/api/resourceIds'

export default {
	[PERFORMANCE_TEST_LAMBDA]: {
		Type: 'AWS::Lambda::Function',
		DependsOn: [
			PERFORMANCE_TEST_DYNAMODB_TABLE,
		],
		Properties: {
			Code: fnBuildPath('performanceTest'),
			Environment: {
				Variables: {
					PERFORMANCE_TEST_DYNAMODB_TABLE: ref(PERFORMANCE_TEST_DYNAMODB_TABLE),
				},
			},
			// FunctionName: String,
			Role: getAtt(PERFORMANCE_TEST_LAMBDA_EXECUTION_ROLE, 'Arn'),
			// Handler: 'index.default',
			MemorySize: 3008,
			Runtime: 'nodejs8.10',
			Timeout: 900,
		},
	},
}
