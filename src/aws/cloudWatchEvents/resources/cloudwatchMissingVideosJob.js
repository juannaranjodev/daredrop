import getAtt from 'root/src/aws/util/getAtt'

import {
	CLOUDWATCH_EVENTS_ROLE, CLOUDWATCH_MISSING_VIDEOS_JOB,
} from 'root/src/aws/cloudWatchEvents/resourceIds'

import { API_LAMBDA_CLOUDWATCH_FUNCTION } from 'root/src/aws/api/resourceIds'

import { UPLOAD_MISSING_VIDEOS } from 'root/src/shared/descriptions/endpoints/endpointIds'

export default {
	[CLOUDWATCH_MISSING_VIDEOS_JOB]: {
		Type: 'AWS::Events::Rule',
		DependsOn: [
			CLOUDWATCH_EVENTS_ROLE, API_LAMBDA_CLOUDWATCH_FUNCTION,
		],
		Properties: {
			Description: 'CloudWatch rule for uploading missing youtube videos (10 AM GMT everyday)',
			Name: 'asdasdas',
			RoleArn: getAtt(CLOUDWATCH_EVENTS_ROLE, 'Arn'),
			ScheduleExpression: 'cron(0 10 * * ? *)',
			State: 'ENABLED',
			Targets: [
				{
					Arn: getAtt(API_LAMBDA_CLOUDWATCH_FUNCTION, 'Arn'),
					Id: 'MissingPayoutsCloudWatchEventsTarget',
					Input: JSON.stringify(
						{
							endpointId: UPLOAD_MISSING_VIDEOS,
							payload: {},
						},
					),
				}],
		},
	},
}
