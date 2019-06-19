import { path } from 'ramda'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import { welcomeEmailTitle } from 'root/src/server/email/util/emailTitles'
import welcomeEmail from 'root/src/server/email/templates/welcome'

export default (request) => {
	const emailData = {
		title: welcomeEmailTitle,
		recipients: [path(['userAttributes', 'email'], request)],
	}
	return sendEmail(emailData, welcomeEmail)
}
