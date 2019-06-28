/* eslint-disable max-len */
import { add, assoc, filter, map, prop, propEq, reduce, test } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import getUserMailFromAssigneeObj from 'root/src/server/api/actionUtil/getUserMailFromAssigneeObj'
import { projectApprovedKey, streamerDeliveryApprovedKey } from 'root/src/server/api/lenses'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import { emailRe } from 'root/src/shared/util/regexes'

export default async (projectId) => {
	const [projectDdb, assigneesDdb, projectPledgesDdb, , payoutDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)
	const payoutsObj = projectSerializer([...assigneesDdb, ...payoutDdb])
	const dareDropFee = reduce((acc, item) => add(acc, prop('pledgeAmount', item)), 0, projectPledgesDdb) * 0.1
	const acceptedAssignees = getAssigneesByStatus(prop('assignees', payoutsObj), streamerDeliveryApprovedKey)
	const requestedTotal = reduce((acc, assignee) => {
		if (!prop('amountRequested', assignee)) {
			return acc
		}
		return add(acc, prop('amountRequested', assignee))
	}, 0, acceptedAssignees)

	const payoutsArr = map(
		(assignee) => {
			// here all Math.rounds and x100 /100 are for nice rounding to 2 decimal places
			const ourCost = Math.round(100 * (prop('capturesAmount', payoutsObj) - dareDropFee) * prop('amountRequested', assignee) / requestedTotal) / 100
			const payoutFeeFromPercentage = Math.round(100 * (ourCost * (1 - 1 / 1.02))) / 100
			const payoutFee = payoutFeeFromPercentage >= 20 ? 20 : payoutFeeFromPercentage
			const assigneeReceives = Math.round(100 * (ourCost - payoutFee)) / 100
			return assoc('payout', assigneeReceives, assignee)
		},
		acceptedAssignees,
	)

	const payoutsWithPaypalEmails = await Promise.all(map(async (assignee) => {
		const userEmail = await getUserMailFromAssigneeObj(assignee)
		return assoc('email', userEmail, assignee)
	}, payoutsArr))

	const mailIsUndefined = filter(propEq('email', 'NO_EMAIL'))
	const mailIsNotUndefined = filter(obj => test(emailRe, prop('email', obj)))

	const usersWithoutPaypalMail = mailIsUndefined(payoutsWithPaypalEmails)
	const usersWithPaypalMail = mailIsNotUndefined(payoutsWithPaypalEmails)

	const payoutTotal = reduce((acc, item) => add(acc, prop('payout', item)), 0, usersWithPaypalMail)

	return {
		dareTitle: prop('title', projectDdb),
		usersWithPaypalMail,
		usersWithoutPaypalMail,
		payoutTotal,
	}
}
