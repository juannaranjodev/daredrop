import apiLambda from 'root/src/aws/api/resources/apiLambda'
import apiLambdaLongTask from 'root/src/aws/api/resources/apiLambdaLongTask'
import apiLambdaCloudwatch from 'root/src/aws/api/resources/apiLambdaCloudwatch'
import apiLambdaExecutionRole from 'root/src/aws/api/resources/apiLambdaExecutionRole'
import apiDynamoDbTable from 'root/src/aws/api/resources/apiDynamoDbTable'
import performanceTestDynamoDbTable from 'root/src/aws/api/resources/performanceTestDynamoDbTable'
import performanceTestDataTable from 'root/src/aws/api/resources/performanceTestDataTable'
import performanceTestLambda from 'root/src/aws/api/resources/performanceTestLambda'
import performanceTestLambdaExecutionRole from 'root/src/aws/api/resources/performanceTestLambdaExecutionRole'


import outputs from 'root/src/aws/api/outputs'
import {
	authPolicies, unauthPolicies,
} from 'root/src/aws/api/cognitoPolicies'

const isDevEnv = process.env.STAGE !== 'production'

const devResources = {
	...performanceTestDynamoDbTable,
	...performanceTestLambda,
	...performanceTestLambdaExecutionRole,
	...performanceTestDataTable,
}

export const apiResources = {
	...apiLambda,
	...apiLambdaExecutionRole,
	...apiDynamoDbTable,
	...apiLambdaLongTask,
	...apiLambdaCloudwatch,
	...(isDevEnv ? devResources : {}),
}

export const apiOutputs = outputs

export const apiAuthPolicies = authPolicies
export const apiUnauthPolicies = unauthPolicies
