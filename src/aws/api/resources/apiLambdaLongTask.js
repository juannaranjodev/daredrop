import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import ref from 'root/src/aws/util/ref'
import getAtt from 'root/src/aws/util/getAtt'

import {
	API_LAMBDA_LONG_TASK_FUNCTION, API_LAMBDA_EXECUTION_ROLE,
	API_DYNAMO_DB_TABLE, PERFORMANCE_TEST_DYNAMODB_DATA_TABLE,
} from 'root/src/aws/api/resourceIds'
import { RECORD_SET } from 'root/src/aws/staticHosting/resourceIds'

export default {
	[API_LAMBDA_LONG_TASK_FUNCTION]: {
		Type: 'AWS::Lambda::Function',
		DependsOn: [
			API_LAMBDA_EXECUTION_ROLE,
			API_DYNAMO_DB_TABLE,
			PERFORMANCE_TEST_DYNAMODB_DATA_TABLE,
			// RECORD_SET,
		],
		Properties: {
			Code: fnBuildPath('api'),
			Environment: {
				Variables: {
					API_DYNAMO_DB_TABLE: ref(API_DYNAMO_DB_TABLE),
					STAGE: process.env.stage || 'development',
					// RECORD_SET: ref(RECORD_SET),
					PERFORMANCE_DATA_TABLE: ref(PERFORMANCE_TEST_DYNAMODB_DATA_TABLE),
				},
			},
			// FunctionName: String,
			Role: getAtt(API_LAMBDA_EXECUTION_ROLE, 'Arn'),
			// Handler: 'index.default',
			MemorySize: 1024,
			Runtime: 'nodejs8.10',
			Timeout: 300,
		},
	},
}
