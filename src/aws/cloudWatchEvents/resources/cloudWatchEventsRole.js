import ref from 'root/src/aws/util/ref'
import join from 'root/src/aws/util/join'
import { CLOUDWATCH_EVENTS_ROLE } from 'root/src/aws/cloudWatchEvents/resourceIds'
import { LAMBDA_ACCESS_SECRET } from 'root/src/aws/secrets/resourceIds'

export default {
	[CLOUDWATCH_EVENTS_ROLE]: {
		Type: 'AWS::IAM::Role',
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
								Resource: join(':', [
									'arn:aws:lambda:*',
									ref('AWS::AccountId'),
									'*:*',
								]),
							},
							{
								Sid: 'AccessToSecretsManager',
								Effect: 'Allow',
								Action: 'secretsmanager:GetSecretValue',
								// edit this
								Resource: ref(LAMBDA_ACCESS_SECRET),
							},
						],
					},
				},
			],
		},
	},
}
