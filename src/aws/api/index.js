import apiLambda from 'root/src/aws/api/resources/apiLambda'
import apiLambdaLongTask from 'root/src/aws/api/resources/apiLambdaLongTask'
import apiLambdaExecutionRole from 'root/src/aws/api/resources/apiLambdaExecutionRole'
import apiDynamoDbTable from 'root/src/aws/api/resources/apiDynamoDbTable'

import outputs from 'root/src/aws/api/outputs'
import {
	authPolicies, unauthPolicies,
} from 'root/src/aws/api/cognitoPolicies'

export const apiResources = {
	...apiLambda,
	...apiLambdaExecutionRole,
	...apiDynamoDbTable,
	...apiLambdaLongTask,
}

export const apiOutputs = outputs

export const apiAuthPolicies = authPolicies
export const apiUnauthPolicies = unauthPolicies
