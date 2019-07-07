/* eslint-disable no-template-curly-in-string */
/* eslint-disable quotes */
import getAtt from 'root/src/aws/util/getAtt'

import {
	CLOUDWATCH_EVENTS_ROLE, CLOUDWATCH_MISSING_PAYOUTS_JOB,
} from 'root/src/aws/cloudWatchEvents/resourceIds'

import { API_LAMBDA_LONG_TASK_FUNCTION } from 'root/src/aws/api/resourceIds'

import { LAMBDA_ACCESS_SECRET } from 'root/src/aws/secrets/resourceIds'

import { PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[CLOUDWATCH_MISSING_PAYOUTS_JOB]: {
		Type: 'AWS::Events::Rule',
		DependsOn: [
			CLOUDWATCH_EVENTS_ROLE, LAMBDA_ACCESS_SECRET, API_LAMBDA_LONG_TASK_FUNCTION,
		],
		Properties: {
			Description: 'CloudWatch rule for submitting outstanding payouts (8 AM GMT every Friday)',
			RoleArn: getAtt(CLOUDWATCH_EVENTS_ROLE, 'Arn'),
			// name is temproary - when name isn't set, then we can't edit
			// our cloudWatch rule(this is important for testing putposes)
			Name: 'asdasdasdsasd',
			ScheduleExpression: 'cron(0 8 ? * 6 *)',
			State: 'ENABLED',
			Targets: [
				{
					Arn: getAtt(API_LAMBDA_LONG_TASK_FUNCTION, 'Arn'),
					Id: 'MissingPayoutsCloudWatchEventsTarget',
					Input: JSON.stringify(
						{
							endpointId: PAY_OUTSTANDING_PAYOUTS,
							payload: {},
						},
					),
				}],
		},
	},
}
