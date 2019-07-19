import apiLambda from 'root/src/aws/api/resources/apiLambda'
import apiLambdaLongTask from 'root/src/aws/api/resources/apiLambdaLongTask'
import apiLambdaCloudwatch from 'root/src/aws/api/resources/apiLambdaCloudwatch'
import apiLambdaExecutionRole from 'root/src/aws/api/resources/apiLambdaExecutionRole'
import apiDynamoDbTable from 'root/src/aws/api/resources/apiDynamoDbTable'
import apiDynamoDbArchivalTable from 'root/src/aws/api/resources/apiDynamoDbArchivalTable'
import performanceTestDynamoDbTable from 'root/src/aws/api/resources/performanceTestDynamoDbTable'
import performanceTestDataTable from 'root/src/aws/api/resources/performanceTestDataTable'
import performanceTestArchivalDataTable from 'root/src/aws/api/resources/performanceTestArchivalDataTable'
import performanceTestLambda from 'root/src/aws/api/resources/performanceTestLambda'
import performanceTestLambdaExecutionRole from 'root/src/aws/api/resources/performanceTestLambdaExecutionRole'
import authenticationLayer from 'root/src/aws/authenticationLayer'
import { isDevEnv } from 'root/src/aws/util/envSelect'

import outputs from 'root/src/aws/api/outputs'
import {
	authPolicies, unauthPolicies,
} from 'root/src/aws/api/cognitoPolicies'


const devResources = {
	...performanceTestDynamoDbTable,
	...performanceTestLambda,
	...performanceTestLambdaExecutionRole,
	...performanceTestDataTable,
	...performanceTestArchivalDataTable,
	...authenticationLayer,
}

export const apiResources = {
	...apiLambda,
	...apiLambdaExecutionRole,
	...apiDynamoDbTable,
	...apiLambdaLongTask,
	...apiLambdaCloudwatch,
	...apiDynamoDbArchivalTable,
	...(isDevEnv ? devResources : {}),
}

export const apiOutputs = outputs

export const apiAuthPolicies = authPolicies
export const apiUnauthPolicies = unauthPolicies
