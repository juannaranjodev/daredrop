import getAtt from 'root/src/aws/util/getAtt'
import join from 'root/src/aws/util/join'

import {
	PERFORMANCE_TEST_LAMBDA_EXECUTION_ROLE, PERFORMANCE_TEST_DYNAMODB_TABLE,
	API_LAMBDA_FUNCTION, API_LAMBDA_LONG_TASK_FUNCTION,
} from 'root/src/aws/api/resourceIds'

export default {
	[PERFORMANCE_TEST_LAMBDA_EXECUTION_ROLE]: {
		Type: 'AWS::IAM::Role',
		DependsOn: [
			PERFORMANCE_TEST_DYNAMODB_TABLE,
			API_LAMBDA_FUNCTION,
			API_LAMBDA_LONG_TASK_FUNCTION,
		],
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: {
							Service: ['lambda.amazonaws.com'],
						},
						Action: ['sts:AssumeRole'],
					},
				],
			},
			Policies: [
				{
					PolicyName: 'root',
					PolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Action: 'lambda:InvokeFunction',
								Resource:
									[
										join('', [getAtt(API_LAMBDA_FUNCTION, 'Arn'), '*']),
										join('', [getAtt(API_LAMBDA_LONG_TASK_FUNCTION, 'Arn'), '*']),
									],
							},
							{
								Effect: 'Allow',
								Action: 'dynamodb:PutItem',
								Resource: join('', [getAtt(PERFORMANCE_TEST_DYNAMODB_TABLE, 'Arn'), '*']),
							},
						],
					},
				},
			],
		},
	},
}
