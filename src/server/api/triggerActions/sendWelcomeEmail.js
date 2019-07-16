import { path } from 'ramda'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import { welcomeEmailTitle } from 'root/src/server/email/util/emailTitles'
import welcomeEmail from 'root/src/server/email/templates/welcome'

export default async (event) => {
	const emailData = {
		title: welcomeEmailTitle,
		recipients: [path(['request', 'userAttributes', 'email'], event)],
	}
	await sendEmail(emailData, welcomeEmail)
	return [null, event]
}
