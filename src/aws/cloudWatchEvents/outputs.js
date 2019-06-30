import { CLOUDWATCH_EVENTS_IAM_ROLE } from 'root/src/aws/cloudWatchEvents/outputIds'
import { CLOUDWATCH_EVENTS_ROLE } from 'root/src/aws/cloudWatchEvents/resourceIds'
import getAtt from 'root/src/aws/util/getAtt'

export default {
	[CLOUDWATCH_EVENTS_IAM_ROLE]: {
		Description: 'IAM role for cloudwatch events',
		Value: getAtt(CLOUDWATCH_EVENTS_ROLE, 'Arn'),
	},
}
