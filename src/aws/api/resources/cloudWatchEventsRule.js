import getAtt from 'root/src/aws/util/getAtt'
import ref from 'root/src/aws/util/ref'

import {
	API_LAMBDA_LONG_TASK_FUNCTION, API_LAMBDA_FUNCTION,
	API_CLOUDWATCH_EVENTS_ROLE, API_CLOUDWATCH_EVENTS_RULE,
	API_LAMBDA_EXECUTION_ROLE,
} from 'root/src/aws/api/resourceIds'


export default {
	[API_CLOUDWATCH_EVENTS_RULE]: {
		Type: 'AWS::Events::Rule',
		DependsOn: [
			API_LAMBDA_FUNCTION,
			API_LAMBDA_LONG_TASK_FUNCTION,
			API_CLOUDWATCH_EVENTS_ROLE,
			API_LAMBDA_EXECUTION_ROLE,
		],
		Properties: {
			Description: 'Rule for CloudWatch Events',
			RoleArn: getAtt(API_CLOUDWATCH_EVENTS_ROLE, 'Arn'),
			State: 'ENABLED',
			EventPattern: JSON.stringify({
				source: ['review.delivery.lambda'],
			}),
			// this one is intentionally expression that will never execute
			// as dynamically set events from lambda need rule with certain
			// source to be executed
			ScheduleExpression: 'cron(0 1 1 1 ? 1999)',
			Targets: [
				{
					Arn: getAtt(API_LAMBDA_LONG_TASK_FUNCTION, 'Arn'),
					Id: ref(API_LAMBDA_LONG_TASK_FUNCTION),
				},
				{
					Arn: getAtt(API_LAMBDA_FUNCTION, 'Arn'),
					Id: ref(API_LAMBDA_FUNCTION),
				},
			],
		},
	},
}
