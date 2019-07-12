import SESConfigurationSetEventBasedEmails from 'root/src/aws/email/resources/SESConfigurationSetEventBasedEmails'
import SESConfigurationSetEventDestination from 'root/src/aws/email/resources/SESConfigurationSetEventDestination'

import outputs from 'root/src/aws/email/outputs'

export const emailResources = {
	...SESConfigurationSetEventBasedEmails,
	...SESConfigurationSetEventDestination,
}

export const emailOutputs = outputs
