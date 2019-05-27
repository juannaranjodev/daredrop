import uuid from 'uuid/v1'
import { map, compose, omit, prop, join, add, assoc, append } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import assigneeSerializer from 'root/src/server/api/serializers/assigneeSerializer'

import sendEmail from 'root/src/server/email/actions/sendEmail'
import dareCreatedEmail from 'root/src/server/email/templates/dareCreated'
import { dareCreatedTitle } from 'root/src/server/email/util/emailTitles'

import { CREATE_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'
import pledgeDynamoObj from 'root/src/server/api/actionUtil/pledgeDynamoObj'
import randomNumber from 'root/src/shared/util/randomNumber'
import { payloadSchemaError } from 'root/src/server/api/errors'
import { projectPendingKey, projectApprovedKey } from 'root/src/server/api/lenses'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import moment from 'moment'
import validateStripeSourceId from 'root/src/server/api/actionUtil/validateStripeSourceId'
import validatePaypalAuthorize from 'root/src/server/api/actionUtil/validatePaypalAuthorize'

const payloadLenses = getPayloadLenses(CREATE_PROJECT)
const {
	viewPaymentInfo, viewPledgeAmount, viewAssignees, viewGames,
} = payloadLenses

export default async ({ userId, payload }) => {
	const serializedProject = await assigneeSerializer({
		project: payload, payloadLenses,
	})
	const projectId = `project-${uuid()}`
	const paymentInfo = viewPaymentInfo(payload)
	const projectCommon = projectDenormalizeFields(serializedProject)

	const created = moment().format()

	const pledgeAmount = viewPledgeAmount(serializedProject)

	if (paymentInfo.paymentType === 'stripeCard' && await !validateStripeSourceId(paymentInfo.paymentId)) {
		throw payloadSchemaError({ stripeCardId: 'Invalid source id' })
	} else if (paymentInfo.paymentType === 'paypalAuthorize' && await !validatePaypalAuthorize(paymentInfo.orderID, pledgeAmount)) {
		throw payloadSchemaError({ paypalAuthorizationId: 'Invalid paypal authorization' })
	}

	const project = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `project|${projectPendingKey}|${randomNumber(1, 10)}`,
		created,
		...projectCommon,
		pledgers: 1,
		favoritesAmount: 0,
	}

	const projectAssignees = map(assignee => ({
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: join('|', [
			'assignee',
			prop('platform', assignee),
			prop('platformId', assignee),
		]),
		accepted: 'pending',
		...omit(['platform', 'platformId'], assignee),
	}), viewAssignees(serializedProject))

	const projectGames = map(game => ({
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: join('|', [
			'game',
			prop('id', game),
		]),
		...omit(['id'], game),
	}), viewGames(serializedProject))

	const pledge = pledgeDynamoObj(
		projectId, serializedProject, userId, true,
	)

	const newMyPledge = assoc('paymentInfo', append(
		assoc('captured', 0, omit(['orderID'], paymentInfo)),
		prop('paymentInfo', pledge),
	), pledge)
	const pledgeUpdated = assoc('pledgeAmount', add(pledgeAmount, prop('pledgeAmount', pledge)), newMyPledge)

	const params = {
		RequestItems: {
			[TABLE_NAME]: map(
				Item => ({ PutRequest: { Item } }),
				[project, ...projectAssignees, ...projectGames, pledgeUpdated],
			),
		},
	}

	await documentClient.batchWrite(params).promise()

	try {
		const email = await getUserEmail(userId)

		const emailData = {
			dareTitle: project.title,
			recipients: [email],
			title: dareCreatedTitle,
		}
		sendEmail(emailData, dareCreatedEmail)
	} catch (err) { }


	return {
		id: projectId,
		userId,
		status: projectPendingKey,
		...projectCommon,
		assignees: viewAssignees(serializedProject),
		pledgers: 1,
		favoritesAmount: 0,
		created,
	}
}
