import { map } from 'ramda'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'

export default async (assigneesWithoutMail) => {
	const userUmails = await Promise.all(map(getUserEmailByTwitchID, assigneesWithoutMail))
	/*
 HERE WE ARE SENDING EMAILS TO ASSIGNEES WITHOUT PAYPAL MAIL
 */
}
