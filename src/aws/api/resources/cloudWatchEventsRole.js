import {
	API_CLOUDWATCH_EVENTS_ROLE,
} from 'root/src/aws/api/resourceIds'

export default {
	[API_CLOUDWATCH_EVENTS_ROLE]: {
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
					PolicyName: 'root',
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
						],
					},
				},
			],
		},
	},
}
