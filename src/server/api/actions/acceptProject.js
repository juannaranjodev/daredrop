import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose, head, contains, join, tail } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import { projectAcceptedKey, streamerAcceptedKey } from 'root/src/server/api/lenses'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import randomNumber from 'root/src/shared/util/randomNumber'
import getAcceptedAssignees from 'root/src/server/api/actionUtil/getAcceptedAssignees'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import dareAcceptedPledgerMail from 'root/src/server/email/templates/dareAcceptedPledger'
import goalMetStreamerEmail from 'root/src/server/email/templates/goalMetStreamer'
import { dareAcceptedTitle, goalMetTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import moment from 'moment'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import setAssigneesStatus from 'root/src/server/api/actionUtil/setAssigneesStatus'

import checkPledgedAmount from 'root/src/server/api/actionUtil/checkPledgedAmount'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const amountRequested = viewAmountRequested(payload)
	const userTokens = await dynamoQueryOAuth(userId)

	const [projectToAcceptDdb, assigneesDdb] = await dynamoQueryProject(
		null,
		projectId,
	)
		const projectToAccept = projectSerializer([
		...projectToAcceptDdb,
		...assigneesDdb,
	])
	const userTokensInProject = userTokensInProjectSelector(userTokens, projectToAccept)

	if (not(gt(length(userTokensInProject), 0))) {
		throw authorizationError('Assignee is not listed on this dare')
	}

	if (!projectToAccept) {
		throw generalError('Project or assignee doesn\'t exist')
	}

	const assigneesInProject = prop('assignees', projectToAccept)

	let projectAcceptedRecord = []

	const acceptedAssigneesInProject = getAcceptedAssignees(assigneesInProject)
	const userTokensStr = map(compose(last, split('-')), userTokensInProject)

	const userAssigneeArrNested = await Promise.all(map(
		token => dynamoQueryProjectAssignee(projectId, token),
		userTokensStr,
	))

	const userAssigneeArr = unnest(unnest(userAssigneeArrNested))

	const assigneesToWrite = map(assignee => ({
		PutRequest: {
			Item:
			{
				[PARTITION_KEY]: assignee[PARTITION_KEY],
				[SORT_KEY]: assignee[SORT_KEY],
				...assignee,
				amountRequested,
				accepted: streamerAcceptedKey,
				modified: getTimestamp(),
			},
		},
	}), userAssigneeArr)

	if (equals(length(acceptedAssigneesInProject), 0)) {
		projectAcceptedRecord = [{
			PutRequest: {
				Item: {
					[PARTITION_KEY]: prop('id', projectToAccept),
					[SORT_KEY]: `project|${projectAcceptedKey}|${randomNumber(1, 10)}`,
					created: getTimestamp(),
				},
			},
		}]

		const acceptationParams = {
			RequestItems: {
				[TABLE_NAME]: [
					...projectAcceptedRecord,
				],
			},
		}

		// await documentClient.batchWrite(acceptationParams).promise()
	}
	const updateProjectParam = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					PutRequest: {
						Item: {
							[PARTITION_KEY]: prop('id', projectToAccept),
							[SORT_KEY]: head(projectToAcceptDdb)[SORT_KEY],
							status: projectAcceptedKey,
							...setAssigneesStatus(projectToAccept, streamerAcceptedKey, userTokensStr, amountRequested),
						},
					},
				},
				...assigneesToWrite,
			],
		},
	}

	// await documentClient.update(updateProjectParam).promise()
	await documentClient.batchWrite(updateProjectParam).promise()

	// try {

	// 	const email = await getUserEmail((prop('creator', projectToAccept)))

	// 	const emailData = {
	// 		title: dareAcceptedTitle,
	// 		dareTitle: prop('title', projectToAccept),
	// 		recipients: [email],
	// 		streamer: prop('displayName', head(userTokens)),
	// 		goal: amountRequested,
	// 		expiryTime: prop('created', projectToAccept)
	// 	}
	// 	console.log(JSON.stringify(emailData, null, 4))
	// 	sendEmail(emailData, dareAcceptedPledgerMail)
	// 	await checkPledgedAmount(projectId)
	// } catch (err) { }


	return omit([PARTITION_KEY, SORT_KEY],
		{
			projectId: projectToAccept[PARTITION_KEY],
			...projectToAccept,
		})
}
