import { SES } from 'aws-sdk'
import { ourEmail } from 'root/src/shared/constants/mail'

const ses = new SES()

export default (emailData, emailTemplate) => new Promise(async (resolve, reject) => {
	const params = {
		Destination: {
			ToAddresses: emailData.recipients,
		},
		Message: {
			Body: {
				Html: {
					Charset: 'UTF-8',
					Data: emailTemplate(emailData),
				},
			},
			Subject: {
				Charset: 'UTF-8',
				Data: emailData.title,
			},
		},
		Source: ourEmail,
		ConfigurationSetName: 'Dare_Drop_Event_Based_Emails',
		Tags: [
			{
				Name: 'message_type',
				Value: 'support',
			},
		],
	}


	ses.sendEmail(params, (err, data) => {
		if (err) {
			reject(err, err.stack)
		} else {
			resolve(data)
		}
	})
})
