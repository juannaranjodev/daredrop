/* eslint-disable no-template-curly-in-string */
/* eslint-disable quotes */
import getAtt from 'root/src/aws/util/getAtt'

import {
	CLOUDWATCH_EVENTS_ROLE, CLOUDWATCH_MISSING_PAYOUTS_JOB,
} from 'root/src/aws/cloudWatchEvents/resourceIds'

import { API_LAMBDA_CLOUDWATCH_FUNCTION } from 'root/src/aws/api/resourceIds'

import { PAY_OUTSTANDING_PAYOUTS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[CLOUDWATCH_MISSING_PAYOUTS_JOB]: {
		Type: 'AWS::Events::Rule',
		DependsOn: [
			CLOUDWATCH_EVENTS_ROLE, API_LAMBDA_CLOUDWATCH_FUNCTION,
		],
		Properties: {
			Description: 'CloudWatch rule for submitting outstanding payouts (8 AM GMT every Friday)',
			RoleArn: getAtt(CLOUDWATCH_EVENTS_ROLE, 'Arn'),
			ScheduleExpression: 'cron(0 8 ? * 6 *)',
			State: 'ENABLED',
			Targets: [
				{
					Arn: getAtt(API_LAMBDA_CLOUDWATCH_FUNCTION, 'Arn'),
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
