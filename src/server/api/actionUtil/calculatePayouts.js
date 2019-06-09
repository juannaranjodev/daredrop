/* eslint-disable max-len */
import { head, prop, map, assoc, add, reduce } from 'ramda'
import { composeE } from 'root/src/shared/util/ramdaPlus'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import { projectApprovedKey } from 'root/src/server/api/lenses'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import dynamoQueryPayoutMethod from 'root/src/server/api/actionUtil/dynamoQueryPayoutMethod'
import buildUserSortKeyFromAssigneeObj from 'root/src/server/api/actionUtil/buildUserSortKeyFromAssigneeObj'
import dynamoGetUserIdFromSK from 'root/src/server/api/actionUtil/dynamoGetUserIdFromSK'

export default async (projectId) => {
	const [projectDdb, assigneesDdb, projectPledgesDdb, , payoutDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)
	const payoutsObj = projectSerializer([...assigneesDdb, ...payoutDdb])
	// here * 100 because calculating payouts with cents is more handy
	const dareDropFee = 100 * reduce((acc, item) => add(acc, prop('pledgeAmount', item)), 0, projectPledgesDdb) * 0.1
	const requestedTotal = reduce((acc, assignee) => add(acc, prop('amountRequested', assignee)),
		0, prop('assignees', payoutsObj))

	const payoutsArr = map(
		assignee => assoc(
			'payout',
			Math.round((prop('capturesAmount', payoutsObj) - dareDropFee) * prop('amountRequested', assignee) / requestedTotal),
			assignee,
		),
		prop('assignees', payoutsObj),
	)

	const payoutsWithPaypalEmails = await Promise.all(map(async (assignee) => {
		const userEmail = await composeE(
			prop('email'), head, dynamoQueryPayoutMethod, dynamoGetUserIdFromSK, buildUserSortKeyFromAssigneeObj,
		)(assignee)
		return assoc('email', userEmail, assignee)
	}, payoutsArr))

	const payoutTotal = reduce((acc, item) => add(acc, prop('payout', item)), 0, payoutsWithPaypalEmails)

	return {
		dareTitle: prop('title', projectDdb),
		payouts: payoutsWithPaypalEmails,
		payoutTotal,
	}
}
