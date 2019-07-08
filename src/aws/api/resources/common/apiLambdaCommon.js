import ref from 'root/src/aws/util/ref'

import {
	API_LAMBDA_EXECUTION_ROLE, API_DYNAMO_DB_TABLE, PERFORMANCE_TEST_DYNAMODB_DATA_TABLE,
} from 'root/src/aws/api/resourceIds'
import { RECORD_SET } from 'root/src/aws/staticHosting/resourceIds'

export const DependsOn = [
	API_LAMBDA_EXECUTION_ROLE,
	API_DYNAMO_DB_TABLE,
	...(process.env.STAGE !== 'production' ? [PERFORMANCE_TEST_DYNAMODB_DATA_TABLE] : []),
	RECORD_SET,
]

export const Environment = {
	Variables: {
		API_DYNAMO_DB_TABLE: ref(API_DYNAMO_DB_TABLE),
		STAGE: process.env.STAGE || 'development',
		RECORD_SET: ref(RECORD_SET),
		PERFORMANCE_TEST_DYNAMODB_TABLE: process.env.STAGE !== 'production' ? ref(PERFORMANCE_TEST_DYNAMODB_DATA_TABLE) : undefined,
	},
}
