import {
	CLOUDFRONT_IAM_ROLE,
} from 'root/src/aws/staticHosting/resourceIds'
import getAtt from 'root/src/aws/util/getAtt'

import { LAMBDA_EDGE_VIEWER_REQUEST_HANDLER, LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER } from 'root/src/aws/lambdaEdge/resourceIds'

export default {
	[CLOUDFRONT_IAM_ROLE]: {
		Type: 'AWS::IAM::Role',
		DependsOn: [LAMBDA_EDGE_VIEWER_REQUEST_HANDLER, LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER],
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
								Action: [
									'lambda:GetFunction',
								],
								Resource: [
									getAtt(LAMBDA_EDGE_ORIGIN_REQUEST_HANDLER, 'Arn'),
									getAtt(LAMBDA_EDGE_VIEWER_REQUEST_HANDLER, 'Arn'),
								],
							},
						],
					},
				},
			],
		},
	},
}
