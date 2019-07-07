import {
	CLOUDFRONT_IAM_ROLE,
} from 'root/src/aws/staticHosting/resourceIds'
import ref from 'root/src/aws/util/ref'

import { LAMBDA_EDGE_VIEWER_VERSION, LAMBDA_EDGE_ORIGIN_VERSION } from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[CLOUDFRONT_IAM_ROLE]: {
		Type: 'AWS::IAM::Role',
		DependsOn: [LAMBDA_EDGE_VIEWER_VERSION, LAMBDA_EDGE_ORIGIN_VERSION],
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: {
							Service: ['cloudfront.amazonaws.com'],
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
								Action: ['*'],
								Resource: ['*'],
							},
						],
					},
				},
			],
		},
	},
}
