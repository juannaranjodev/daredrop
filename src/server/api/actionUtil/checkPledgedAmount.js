import { prop, reduce, filter, hasPath, gt, map, add } from 'ramda'

import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import goalMetStreamerEmail from 'root/src/server/email/templates/goalMetStreamer'
import { goalMetTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'


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
	if (gt(prop('pledgeAmount', projectToCheck), allAcceptedAmount)) {
		await Promise.all(
			map(async (assignee) => {
				const streamerEmail = await getUserEmailByTwitchID(prop('platformId', assignee))
				const emailData = {
					title: goalMetTitle,
					dareTitle: prop('title', projectToCheck),
					recipients: [streamerEmail],
					dareDescription: prop('description', projectToCheck),
					bountyAmount: prop('pledgeAmount', projectToCheck),
					dareHref: projectHrefBuilder(prop('id', projectToCheck)),
					goal: prop('amountRequested', assignee),
					expiryTime: prop('created', projectToCheck),
				}
				sendEmail(emailData, goalMetStreamerEmail)
			}, acceptedAssignees),
		)
	}
}
