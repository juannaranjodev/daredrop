/* eslint-disable no-console */
/* eslint-disable max-len */
import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose, head, reduce, isNil, uniq, concat, hasPath, filter } from 'ramda'
// keys
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { projectAcceptedKey, streamerAcceptedKey } from 'root/src/shared/descriptions/apiLenses'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

// lenses
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'

// Query utils
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'

// utils
import arrayToStringParser from 'root/src/server/api/serializers/arrayToStringParser'
import checkPledgedAmount from 'root/src/server/api/actionUtil/checkPledgedAmount'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import randomNumber from 'root/src/shared/util/randomNumber'
import setAssigneesStatus from 'root/src/server/api/actionUtil/setAssigneesStatus'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'

// serializers
import { dareAcceptedCreatorTitle, dareAcceptedStreamerTitle } from 'root/src/server/email/util/emailTitles'
import dareAcceptedPledgerMail from 'root/src/server/email/templates/dareAcceptedPledger'
import dareAcceptedStreamerMail from 'root/src/server/email/templates/dareAcceptedStreamer'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import sendEmail from 'root/src/server/email/actions/sendEmail'

import getPledgersByProjectID from 'root/src/server/api/actionUtil/getPledgersByProjectID'
import getFavoritesByProjectID from 'root/src/server/api/actionUtil/getFavoritesByProjectID'

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
	await checkPledgedAmount(projectId)

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

	const acceptedAssigneesInProject = getAssigneesByStatus(assigneesInProject, streamerAcceptedKey)
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

		await documentClient.batchWrite(acceptationParams).promise()
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

	await documentClient.batchWrite(updateProjectParam).promise()

	try {
		const [projectToAcceptDdbEmail, assigneesDdbEmail] = await dynamoQueryProject(
			null,
			projectId,
		)
		const projectToAcceptEmail = projectSerializer([
			...projectToAcceptDdbEmail,
			...assigneesDdbEmail,
		])

		const streamerList = map(
			streamer => prop('displayName', streamer),
			filter(
				hasPath(['amountRequested']),
				prop('assignees', projectToAcceptEmail),
			),
		)
		const sumAmountRequested = reduce((accum, streamer) => {
			if (hasPath(['amountRequested'], streamer)) {
				return accum + prop('amountRequested', streamer)
			}
			return accum
		}, 0, prop('assignees', projectToAcceptEmail))

		// Send email for pledgers & favorites

		const allPledgersAndFavorites = compose(uniq, concat)(
			await getPledgersByProjectID(projectId), await getFavoritesByProjectID(projectId),
		)
		const allPledgersAndFavoritesEmails = await Promise.all(
			map(uid => getUserEmail(uid),
				allPledgersAndFavorites),
		)
		sendEmail({
			title: dareAcceptedCreatorTitle,
			dareTitle: prop('title', projectToAccept),
			dareTitleLink: projectHrefBuilder(prop('id', projectToAccept)),
			recipients: allPledgersAndFavoritesEmails,
			streamers: arrayToStringParser(streamerList),
			goal: sumAmountRequested,
			expiryTime: prop('created', projectToAccept),
		}, dareAcceptedPledgerMail)

		// Send email for Streamer
		const emailStreamer = await getUserEmail(userId)

		const emailDataForStreamer = {
			title: dareAcceptedStreamerTitle,
			dareTitle: prop('title', projectToAccept),
			dareTitleLink: projectHrefBuilder(prop('id', projectToAccept)),
			recipients: [emailStreamer],
			streamer: prop('displayName', head(userTokens)),
			goal: amountRequested,
			expiryTime: prop('created', projectToAccept),
		}
		sendEmail(emailDataForStreamer, dareAcceptedStreamerMail)
		await checkPledgedAmount(projectId)
	} catch (err) {
		console.log('ses error')
	}


	return omit([PARTITION_KEY, SORT_KEY], projectToAccept)
}
