import fnBuildPath from 'root/src/aws/util/fnBuildPath'
import ref from 'root/src/aws/util/ref'
import getAtt from 'root/src/aws/util/getAtt'

import {
	API_LAMBDA_FUNCTION, API_LAMBDA_EXECUTION_ROLE, API_DYNAMO_DB_TABLE,
} from 'root/src/aws/api/resourceIds'
import { DOMAIN_NAME } from 'root/src/aws/staticHosting/outputIds'

export default {
	[API_LAMBDA_FUNCTION]: {
		Type: 'AWS::Lambda::Function',
		DependsOn: [
			API_LAMBDA_EXECUTION_ROLE,
			API_DYNAMO_DB_TABLE,
			DOMAIN_NAME,
		],
		Properties: {
			Code: fnBuildPath('api'),
			Environment: {
				Variables: {
					API_DYNAMO_DB_TABLE: ref(API_DYNAMO_DB_TABLE),
					DOMAIN_NAME: ref(DOMAIN_NAME),
				},
			},
			// FunctionName: String,
			Role: getAtt(API_LAMBDA_EXECUTION_ROLE, 'Arn'),
			// Handler: 'index.default',
			MemorySize: 512,
			Runtime: 'nodejs8.10',
			Timeout: 4,
		},
	},
}
