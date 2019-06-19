import { SES } from 'aws-sdk'
import { ourEmail } from 'root/src/shared/constants/mail'

const ses = new SES()

export default (emailData, emailTemplate) => {
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


	return ses.sendEmail(params, (err, data) => new Promise((resolve, reject) => {
		if (err) {
			reject(err, err.stack)
		} else {
			console.log('SM')
			console.log(data)
			resolve(data)
		}
	}))
}
