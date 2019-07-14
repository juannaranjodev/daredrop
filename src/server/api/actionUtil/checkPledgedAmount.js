import { prop, reduce, filter, hasPath, gt, map, add, compose, uniq, concat } from 'ramda'

import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import goalMetStreamerEmail from 'root/src/server/email/templates/goalMetStreamer'
import { goalMetTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import golMetPledgerEmail from 'root/src/server/email/templates/goalMet'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import getPledgersByProjectID from 'root/src/server/api/actionUtil/getPledgersByProjectID'
import getFavoritesByProjectID from 'root/src/server/api/actionUtil/getFavoritesByProjectID'
import arrayToStringParser from 'root/src/server/api/serializers/arrayToStringParser'

export default async (projectId) => {
	const [projectToCheckDdb, assigneesDdb] = await dynamoQueryProject(
		null,
		projectId,
	)
	const projectToCheck = projectSerializer([
		...projectToCheckDdb,
		...assigneesDdb,
	])


	const assigneesInProject = prop('assignees', projectToCheck)

	const acceptedAssignees = filter(assign => hasPath(['amountRequested'], assign), assigneesInProject)
	const allAcceptedAmount = reduce((result, assign) => add(result, prop('amountRequested', assign)),
		0, acceptedAssignees)
	const streamerList = map(
		streamer => prop('displayName', streamer),
		acceptedAssignees,
	)
	if (gt(prop('pledgeAmount', projectToCheck), allAcceptedAmount)) {
		// Send golMet email for streamer
		await Promise.all(
			map(async (assignee) => {
				const streamerEmail = await getUserEmailByTwitchID(prop('platformId', assignee))
				const emailData = {
					title: goalMetTitle,
					dareTitle: prop('title', projectToCheck),
					recipients: [streamerEmail],
					dareDescription: prop('description', projectToCheck),
					bountyAmount: prop('pledgeAmount', projectToCheck),
					dareTitleLink: projectHrefBuilder(prop('id', projectToCheck)),
					goal: prop('amountRequested', assignee),
					expiryTime: prop('created', projectToCheck),
				}
				sendEmail(emailData, goalMetStreamerEmail)
			}, acceptedAssignees),
		)
		// Send golMet email for Pledgers
		const allPledgersAndFavorites = compose(uniq, concat)(
			await getPledgersByProjectID(projectId), await getFavoritesByProjectID(projectId),
		)
		const allPledgersAndFavoritesEmails = await Promise.all(
			map(uid => getUserEmail(uid),
				allPledgersAndFavorites),
		)
		sendEmail({
			title: goalMetTitle,
			dareTitle: prop('title', projectToCheck),
			dareTitleLink: projectHrefBuilder(prop('id', projectToCheck)),
			recipients: allPledgersAndFavoritesEmails,
			streamerList,
			goal: allAcceptedAmount,
			expiryTime: prop('created', streamerList),
		}, golMetPledgerEmail)
	}
}
