import ref from 'root/src/aws/util/ref'

import {
	SES_CONFIGURATION_SET_EVENT_BASED_EMAILS,
} from 'root/src/aws/email/resourceIds'

import {
	SES_CONFIGURATION_SET_EVENT_BASED_EMAILS_ARN,
} from 'root/src/aws/email/outputIds'

export default {
	[SES_CONFIGURATION_SET_EVENT_BASED_EMAILS_ARN]: {
		Description: 'Arn for SES configuration set',
		Value: ref(SES_CONFIGURATION_SET_EVENT_BASED_EMAILS),
	},
}
