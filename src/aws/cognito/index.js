import cognitoAuthRole from 'root/src/aws/cognito/resources/cognitoAuthRole'
import cognitoUnauthRole from 'root/src/aws/cognito/resources/cognitoUnauthRole'
import identityPool from 'root/src/aws/cognito/resources/identityPool'
import identityPoolRoleAttachment from 'root/src/aws/cognito/resources/identityPoolRoleAttachment'
import userPool from 'root/src/aws/cognito/resources/userPool'
import userPoolClient from 'root/src/aws/cognito/resources/userPoolClient'
import adminUserPoolGroup from 'root/src/aws/cognito/resources/adminUserPoolGroup'
import lambdaTriggerInvokePermission from 'root/src/aws/cognito/resources/lambdaTriggerInvokePermission'

import outputs from 'root/src/aws/cognito/outputs'

export const cognitoResources = {
	...cognitoAuthRole,
	...cognitoUnauthRole,
	...identityPool,
	...identityPoolRoleAttachment,
	...userPool,
	...userPoolClient,
	...adminUserPoolGroup,
	...lambdaTriggerInvokePermission,
}

export const cognitoOutputs = outputs
