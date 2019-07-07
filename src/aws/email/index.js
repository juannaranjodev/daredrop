import SESConfigurationSetEventBasedEmails from 'root/src/aws/email/resources/SESConfigurationSetEventBasedEmails'

import outputs from 'root/src/aws/email/outputs'

export const emailResources = {
	...SESConfigurationSetEventBasedEmails,
}

export const emailOutputs = outputs
