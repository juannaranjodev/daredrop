import { path } from 'ramda'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import { welcomeEmailTitle } from 'root/src/server/email/util/emailTitles'
import welcomeEmail from 'root/src/server/email/templates/welcome'

export default request => new Promise(async (resolve) => {
	const emailData = {
		title: welcomeEmailTitle,
		recipients: [path(['userAttributes', 'email'], request)],
	}
	const res = await sendEmail(emailData, welcomeEmail)
	console.log('SWM')
	console.log(res)
	resolve(res)
})
