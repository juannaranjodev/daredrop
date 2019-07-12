import getAtt from 'root/src/aws/util/getAtt'
import { LAMBDA_TRIGGER_INVOKE_PERMISSION, USER_POOL } from 'root/src/aws/cognito/resourceIds'
import { API_LAMBDA_FUNCTION } from 'root/src/aws/api/resourceIds'

export default {
	[LAMBDA_TRIGGER_INVOKE_PERMISSION]: {
		Type: 'AWS::Lambda::Permission',
		Properties: {
			Action: 'lambda:InvokeFunction',
			FunctionName: getAtt(API_LAMBDA_FUNCTION, 'Arn'),
			Principal: 'cognito-idp.amazonaws.com',
			SourceArn: getAtt(USER_POOL, 'Arn'),
		},
	},
}
