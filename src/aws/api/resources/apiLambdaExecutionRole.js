import getAtt from 'root/src/aws/util/getAtt'
import join from 'root/src/aws/util/join'
import ref from 'root/src/aws/util/ref'

import {
	API_LAMBDA_EXECUTION_ROLE, API_DYNAMO_DB_TABLE,
	PERFORMANCE_TEST_DYNAMODB_DATA_TABLE, API_DYNAMO_DB_ARCHIVAL_TABLE,
	PERFORMANCE_TEST_ARCHIVAL_DYNAMODB_DATA_TABLE,
} from 'root/src/aws/api/resourceIds'

import { CLOUDWATCH_EVENTS_ROLE } from 'root/src/aws/cloudWatchEvents/resourceIds'

export default {
	[API_LAMBDA_EXECUTION_ROLE]: {
		Type: 'AWS::IAM::Role',
		DependsOn: [
			API_DYNAMO_DB_TABLE, CLOUDWATCH_EVENTS_ROLE, API_DYNAMO_DB_ARCHIVAL_TABLE,
			...(process.env.STAGE !== 'production' ? [
				PERFORMANCE_TEST_DYNAMODB_DATA_TABLE,
				PERFORMANCE_TEST_ARCHIVAL_DYNAMODB_DATA_TABLE,
			] : []),
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
								Action: [
									'logs:CreateLogGroup',
									'logs:CreateLogStream',
									'logs:PutLogEvents',
									'logs:DescribeLogStreams',
								],
								Resource: [
									'arn:aws:logs:*:*:*',
								],
							},
							{
								Effect: 'Allow',
								Action: [
									'ses:SendEmail',
								],
								Resource: join(
									':',
									[
										'arn:aws:ses',
										ref('AWS::Region'),
										ref('AWS::AccountId'),
										'*',
									],
								),
							},
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
							{
								Effect: 'Allow',
								Action: 'secretsmanager:GetSecretValue',
								Resource: 'arn:aws:secretsmanager:*:*:*',
							},
							{
								Effect: 'Allow',
								Action: [
									'cognito-idp:AdminGetUser',
								],
								Resource: [
									'arn:aws:cognito-idp:*:*:*',
								],
							},
							{
								Effect: 'Allow',
								Action: [
									'dynamodb:DescribeTable',
									'dynamodb:Query',
									'dynamodb:Scan',
									'dynamodb:GetItem',
									'dynamodb:PutItem',
									'dynamodb:UpdateItem',
									'dynamodb:DeleteItem',
									'dynamodb:BatchWriteItem',
									'dynamodb:BatchGetItem',
									'dynamodb:BatchGetItem',
								],
								// For ARN/index/x_index
								Resource: [
									join('', [getAtt(API_DYNAMO_DB_TABLE, 'Arn'), '*']),
									join('', [getAtt(API_DYNAMO_DB_ARCHIVAL_TABLE, 'Arn'), '*']),
									...(process.env.STAGE !== 'production' ? [
										join('', [getAtt(PERFORMANCE_TEST_DYNAMODB_DATA_TABLE, 'Arn'), '*']),
										join('', [getAtt(PERFORMANCE_TEST_ARCHIVAL_DYNAMODB_DATA_TABLE, 'Arn'), '*']),
									] : []),
								],
							},
							{
								Sid: 'CloudWatchEventsFullAccess',
								Effect: 'Allow',
								Action: ['events:*'],
								Resource: '*',
							},
							{
								Sid: 'IAMPassRoleForCloudWatchEvents',
								Effect: 'Allow',
								Action: 'iam:PassRole',
								Resource: getAtt(CLOUDWATCH_EVENTS_ROLE, 'Arn'),
							},
						],
					},
				},
			],
		},
	},
}
