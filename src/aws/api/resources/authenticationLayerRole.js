import join from 'root/src/aws/util/join'
import ref from 'root/src/aws/util/ref'

import {
	AUTHENTICATION_LAYER_FUNCTION_ROLE,
} from 'root/src/aws/api/resourceIds'

export default {
	[AUTHENTICATION_LAYER_FUNCTION_ROLE]: {
		Type: 'AWS::IAM::Role',
		Properties: {
			AssumeRolePolicyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: 'Allow',
						Principal: {
							Service: [
								'lambda.amazonaws.com',
								'edgelambda.amazonaws.com',
							],
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
								Action: [
									'lambda:AddPermission',
									'lambda:RemovePermission',
								],
								Resource: join(
									':',
									[
										'arn:aws:lambda:us-east-1',
										ref('AWS::AccountId'),
										'*:*',
									],
								),
							},
						],
					},
				},
			],

		},
	},
}
