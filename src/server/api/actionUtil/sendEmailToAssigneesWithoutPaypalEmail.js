import { map, compose, prop } from 'ramda'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import payoutFailure from 'root/src/server/email/templates/payoutFailure'
import { payoutFailureTitle } from 'root/src/server/email/util/emailTitles'

export default async (assigneesWithoutMail) => {
	const userEmails = await Promise.all(map(compose(getUserEmailByTwitchID, prop('platformId')), assigneesWithoutMail))

	const emailDataForCreator = {
		title: payoutFailureTitle,
		recipients: userEmails,
	}
	await sendEmail(emailDataForCreator, payoutFailure)
}
