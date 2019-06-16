import {
	LAMBDA_EDGE_EXECUTION_ROLE,
} from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[LAMBDA_EDGE_EXECUTION_ROLE]: {
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
								Action: [
									'lambda:GetFunction',
								],
								Resource: ['*'],
							},
						],
					},
				},
			],
		},
	},
}
