import ref from 'root/src/aws/util/ref'
import {
	SES_CONFIGURATION_SET_EVENT_DESTINATION_EVENT_BASED_EMAILS, SES_CONFIGURATION_SET_EVENT_BASED_EMAILS,
} from 'root/src/aws/email/resourceIds'

export default {
	[SES_CONFIGURATION_SET_EVENT_DESTINATION_EVENT_BASED_EMAILS]: {
		Type: 'AWS::SES::ConfigurationSetEventDestination',
		Properties: {
			ConfigurationSetName: ref(SES_CONFIGURATION_SET_EVENT_BASED_EMAILS),
			EventDestination: {
				CloudWatchDestination: {
					DimensionConfigurations: [
						{
							DefaultDimensionValue: 'support',
							DimensionName: 'message_type',
							DimensionValueSource: 'messageTag',
						},
					],
				},
				Enabled: true,
				MatchingEventTypes: ['send', 'reject', 'delivery', 'bounce', 'complaint', 'click', 'open', 'renderingFailure'],
			},
		},
	},
}
