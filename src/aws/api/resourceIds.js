import resourcePrefix from 'root/src/aws/util/resourcePrefix'

export const API_LAMBDA_FUNCTION = `${resourcePrefix}ApiLambdaFunction`
export const API_LAMBDA_LONG_TASK_FUNCTION = `${resourcePrefix}ApiLambdaLongTaskFunction`
export const API_LAMBDA_EXECUTION_ROLE = `${resourcePrefix}ApiLambdaExecutionRole`

export const API_DYNAMO_DB_TABLE = `${resourcePrefix}ApiDynamoDbTable`

export const PERFORMANCE_TEST_LAMBDA_EXECUTION_ROLE = `${resourcePrefix}PerformanceTestLambdaExecutionRole`
export const PERFORMANCE_TEST_LAMBDA = `${resourcePrefix}PerformanceTestLambda`
export const PERFORMANCE_TEST_DYNAMODB_TABLE = `${resourcePrefix}PerformanceTestDynamoDbTable`
export const PERFORMANCE_TEST_DYNAMODB_DATA_TABLE = `${resourcePrefix}PerformanceTestDynamoDbDataTable`
