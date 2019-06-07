import sendEmail from 'root/src/server/email/actions/sendEmail'
import welcomeMail from 'root/src/server/email/templates/welcome'
import { welcomeMailTitle } from 'root/src/server/email/util/emailTitles'

export default async ({ payload }) => {
	const { email } = payload
	const emailData = {
		title: welcomeMailTitle,
		recipients: [email],
	}
	sendEmail(emailData, welcomeMail)

	return {
		status: 200,
		message: 'send success',
	}
}
