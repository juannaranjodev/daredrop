/* eslint-disable no-console */
/* eslint-disable max-len */
import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose, head, reduce, slice, isNil } from 'ramda'

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
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import dareAcceptedPledgerMail from 'root/src/server/email/templates/dareAcceptedPledger'
import dareAcceptedStreamerMail from 'root/src/server/email/templates/dareAcceptedStreamer'
import { dareAcceptedCreatorTitle, dareAcceptedStreamerTitle } from 'root/src/server/email/util/emailTitles'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import setAssigneesStatus from 'root/src/server/api/actionUtil/setAssigneesStatus'
import arrayToStringParser from 'root/src/server/api/serializers/arrayToStringParser'
import { ourUrl } from 'root/src/shared/constants/mail'

import checkPledgedAmount from 'root/src/server/api/actionUtil/checkPledgedAmount'

const payloadLenses = getPayloadLenses(ACCEPT_PROJECT)
const { viewProjectId, viewAmountRequested } = payloadLenses

export default async ({ payload, userId }) => {
	const projectId = viewProjectId(payload)
	const amountRequested = viewAmountRequested(payload)
	const userTokens = await dynamoQueryOAuth(userId)

	const [projectToAcceptDdb, assigneesDdb, projectPledgesDdb, projectFavouriteDdb] = await dynamoQueryProject(
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

		// Send email for Creator
		const emailCreator = await getUserEmail((prop('creator', projectToAccept)))

		const streamerList = map(streamer => prop('displayName', streamer), prop('assignees', projectToAcceptEmail))

		const sumAmountRequested = reduce((accum, streamer) => {
			if (!isNil(streamer.amountRequested)) {
				return accum + streamer.amountRequested
			}
			return accum
		}, 0, prop('assignees', projectToAcceptEmail))

		const titleDareLink = `http://${ourUrl}/view-project`


		const emailDataForCreator = {
			title: dareAcceptedCreatorTitle,
			dareTitle: prop('title', projectToAccept),
			dareTitleLink: titleDareLink,
			recipients: [emailCreator],
			streamers: arrayToStringParser(streamerList),
			goal: amountRequested,
			expiryTime: prop('created', projectToAccept),
		}
		sendEmail(emailDataForCreator, dareAcceptedPledgerMail)

		// Send email for pledgers
		const pledgerUserIds = reduce(
			(result, pledgedProject) => [...result, prop('sk', pledgedProject)], [], projectPledgesDdb,
		)
		await Promise.all(
			map(async (pledgerUserId) => {
				const pledgerEmail = await getUserEmail(slice(7, Infinity, pledgerUserId))
				const emailDataForPledger = {
					title: dareAcceptedCreatorTitle,
					dareTitle: prop('title', projectToAccept),
					recipients: [plederEmail],
					streamers: arrayToStringParser(streamerList),
					dareTitleLink: titleDareLink,
					goal: sumAmountRequested,
					expiryTime: prop('created', projectToAccept),
				}
				sendEmail(emailDataForPledger, dareAcceptedPledgerMail)
			}, pledgerUserIds),
		)
		// Send email for favourite

		const favouriteUserIds = reduce(
			(result, favouriteProject) => [...result, prop('sk', favouriteProject)], [], projectFavouriteDdb,
		)
		await Promise.all(
			map(async (favouriteUserId) => {
				const favouriteEmail = await getUserEmail(slice(10, Infinity, favouriteUserId))
				const emailDataForFavourite = {
					title: dareAcceptedCreatorTitle,
					dareTitle: prop('title', projectToAccept),
					dareTitleLink: titleDareLink,
					recipients: [favouriteEmail],
					streamers: arrayToStringParser(streamerList),
					goal: amountRequested,
					expiryTime: prop('created', projectToAccept),
				}
				sendEmail(emailDataForFavourite, dareAcceptedPledgerMail)
			}, favouriteUserIds),
		)

		// Send email for Streamer
		const emailStreamer = await getUserEmail((prop('creator', userId)))

		const emailDataForStreamer = {
			title: dareAcceptedStreamerTitle,
			dareTitle: prop('title', projectToAccept),
			dareTitleLink: titleDareLink,
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
