import { AUTHENTICATION_LAYER_EXECUTION_ROLE } from 'root/src/aws/authenticationLayer/resourceIds'
import join from 'root/src/aws/util/join'
import ref from 'root/src/aws/util/ref'

export default {
	[AUTHENTICATION_LAYER_EXECUTION_ROLE]: {
		Type: 'AWS::IAM::Role',
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: {
							Service: ['lambda.amazonaws.com', 'edgelambda.amazonaws.com'],
						},
						Action: ['sts:AssumeRole'],
					},
				],
			},
			Policies: [
				{
					PolicyName: 'CloudFrontPolicy',
					PolicyDocument: {
						Version: '2012-10-17',
						Statement: [
							{
								Effect: 'Allow',
								Action: ['lambda:GetFunction', 'lambda:ReplicateFunction'],
								Resource: [
									join(':',
										['arn:aws:lambda:us-east-1',
											ref('AWS::AccountId'),
											'function:*:*',
										])],
							},
							{
								Effect: 'Allow',
								Action: ['iam:CreateServiceLinkedRole'],
								Resource: [
									join(':',
										['arn:aws:iam:',
											ref('AWS::AccountId'),
											'role/*',
										])],
							},
							{
								Effect: 'Allow',
								Action: ['cloudfront:UpdateDistribution'],
								Resource: join(':',
									['arn:aws:cloudfront:',
										ref('AWS::AccountId'),
										'distribution/*',
									]),
							},
						],
					},
				},
			],
		},
	},
}
