import getAtt from 'root/src/aws/util/getAtt'
import { CLOUDWATCH_EVENTS_ROLE } from 'root/src/aws/cloudWatchEvents/resourceIds'
import {
	API_LAMBDA_FUNCTION, API_LAMBDA_LONG_TASK_FUNCTION,
} from 'root/src/aws/api/resourceIds'

export default {
	[CLOUDWATCH_EVENTS_ROLE]: {
		Type: 'AWS::IAM::Role',
		DependsOn: [
			API_LAMBDA_FUNCTION, API_LAMBDA_LONG_TASK_FUNCTION,
		],
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: {
							Service: 'events.amazonaws.com',
						},
						Action: 'sts:AssumeRole',
					},
				],
			},
			Policies: [
				{
					PolicyName: 'cloudwatchevents',
					PolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Sid: 'CloudWatchEventsFullAccess',
								Effect: 'Allow',
								Action: 'events:*',
								Resource: '*',
							},
							{
								Sid: 'IAMPassRoleForCloudWatchEvents',
								Effect: 'Allow',
								Action: 'iam:PassRole',
								Resource: 'arn:aws:iam::*:role/AWS_Events_Invoke_Targets',
							},
							{
								Sid: 'InvokeLambda',
								Effect: 'Allow',
								Action: 'lambda:InvokeFunction',
								Resource: getAtt(API_LAMBDA_LONG_TASK_FUNCTION, 'Arn'),
							},
							{
								Sid: 'AccessToSecretsManager',
								Effect: 'Allow',
								Action: 'secretsmanager:GetSecretValue',
								// edit this
								Resource: '*',
							},
						],
					},
				},
			],
		},
	},
}
