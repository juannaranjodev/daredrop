/* eslint-disable no-console */
/* eslint-disable max-len */
import { prop, unnest, equals, not, length, gt, last, split, omit, map, compose, head, reduce, slice, isNil } from 'ramda'
//keys
import { ACCEPT_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { projectAcceptedKey, streamerAcceptedKey } from 'root/src/server/api/lenses'
import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

//lenses
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'

//Query utils
import dynamoQueryOAuth from 'root/src/server/api/actionUtil/dynamoQueryOAuth'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryProjectAssignee from 'root/src/server/api/actionUtil/dynamoQueryProjectAssignee'

//utils
import arrayToStringParser from 'root/src/server/api/serializers/arrayToStringParser'
import checkPledgedAmount from 'root/src/server/api/actionUtil/checkPledgedAmount'
import { generalError, authorizationError } from 'root/src/server/api/errors'
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import randomNumber from 'root/src/shared/util/randomNumber'
import setAssigneesStatus from 'root/src/server/api/actionUtil/setAssigneesStatus'
import userTokensInProjectSelector from 'root/src/server/api/actionUtil/userTokensInProjectSelector'

//serializers
import { dareAcceptedCreatorTitle, dareAcceptedStreamerTitle } from 'root/src/server/email/util/emailTitles'
import dareAcceptedPledgerMail from 'root/src/server/email/templates/dareAcceptedPledger'
import dareAcceptedStreamerMail from 'root/src/server/email/templates/dareAcceptedStreamer'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import sendEmail from 'root/src/server/email/actions/sendEmail'

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

		const emailDataForCreator = {
			title: dareAcceptedCreatorTitle,
			dareTitle: prop('title', projectToAccept),
			dareTitleLink: projectHrefBuilder(prop('id', projectToAccept)),
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
					dareTitleLink: projectHrefBuilder(prop('id', projectToAccept)),
					recipients: [plederEmail],
					streamers: arrayToStringParser(streamerList),
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
					dareTitleLink: projectHrefBuilder(prop('id', projectToAccept)),
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
