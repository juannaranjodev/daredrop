import {
	USER_POOL,
} from 'root/src/aws/cognito/resourceIds'
import { API_LAMBDA_FUNCTION } from 'root/src/aws/api/resourceIds'
import getAtt from 'root/src/aws/util/getAtt'

export default {
	[USER_POOL]: {
		Type: 'AWS::Cognito::UserPool',
		Properties: {
			// AliasAttributes: ['email'],
			UsernameAttributes: ['email'],
			// This poorly named key means 'require verification for emails'
			AutoVerifiedAttributes: ['email'],
			EmailVerificationSubject: 'Your verification code',
			EmailVerificationMessage: 'Your verification code is {####}.',
			UserPoolName: USER_POOL,
			LambdaConfig: {
				PostConfirmation: getAtt(API_LAMBDA_FUNCTION, 'Arn'),
			},
		},
	},
}
