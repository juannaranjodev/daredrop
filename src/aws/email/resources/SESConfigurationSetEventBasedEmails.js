import {
	SES_CONFIGURATION_SET_EVENT_BASED_EMAILS,
} from 'root/src/aws/email/resourceIds'

export default {
	[SES_CONFIGURATION_SET_EVENT_BASED_EMAILS]: {
		Type: 'AWS::SES::ConfigurationSet',
		Properties: {},
	},
}
