/* eslint-disable max-len */
/* eslint-disable no-console */
import uuid from 'uuid/v1'
import { map, omit, prop, join, add, assoc, append } from 'ramda'

// keys
import { CREATE_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { payloadSchemaError } from 'root/src/server/api/errors'
import { projectPendingKey, projectApprovedKey } from 'root/src/shared/descriptions/apiLenses'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

// lenses
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'

// utils
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import moment from 'moment'
import pledgeDynamoObj from 'root/src/server/api/actionUtil/pledgeDynamoObj'
import projectDenormalizeFields from 'root/src/server/api/actionUtil/projectDenormalizeFields'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import randomNumber from 'root/src/shared/util/randomNumber'
import stripeAuthorizePayment from 'root/src/server/api/actionUtil/stripeAuthorizePayment'
import validateStripeSourceId from 'root/src/server/api/actionUtil/validateStripeSourceId'
import validatePaypalAuthorize from 'root/src/server/api/actionUtil/validatePaypalAuthorize'

// email
import sendEmail from 'root/src/server/email/actions/sendEmail'
import dareCreatedEmail from 'root/src/server/email/templates/dareCreated'
import dareApprovedEmail from 'root/src/server/email/templates/dareApproved'
import { dareCreatedTitle, dareApprovedTitle } from 'root/src/server/email/util/emailTitles'

// other
import assigneeSerializer from 'root/src/server/api/serializers/assigneeSerializer'
import { stripeCard, paypalAuthorize } from 'root/src/shared/constants/paymentTypes'

import { autoApproveFlag } from 'root/src/shared/constants/flags'

const payloadLenses = getPayloadLenses(CREATE_PROJECT)
const {
	viewPaymentInfo, viewPledgeAmount, viewAssignees, viewGames,
} = payloadLenses

export default async ({ userId, payload }) => {
	const serializedProject = await assigneeSerializer({
		project: payload, payloadLenses,
	})
	const projectId = `project-${uuid()}`
	const projectCommon = projectDenormalizeFields(serializedProject)
	let paymentInfo = viewPaymentInfo(payload)

	const created = moment().format()

	const pledgeAmount = viewPledgeAmount(serializedProject)

	// validations
	if (paymentInfo.paymentType === stripeCard) {
		const validationCardId = await validateStripeSourceId(paymentInfo.paymentId)
		if (!validationCardId) {
			throw payloadSchemaError({ stripeCardId: 'Invalid source id' })
		}
		const stripeAuthorization = await stripeAuthorizePayment(pledgeAmount, paymentInfo.paymentId, userId, projectId)
		if (!stripeAuthorization.authorized) {
			throw payloadSchemaError(stripeAuthorization.error)
		}
		paymentInfo = assoc('paymentId', stripeAuthorization.id, paymentInfo)
	} else if (paymentInfo.paymentType === paypalAuthorize) {
		const validation = await validatePaypalAuthorize(paymentInfo.paymentId, pledgeAmount)
		if (!validation) {
			throw payloadSchemaError({ paypalAuthorizationId: 'Invalid paypal authorization' })
		}
	}

	const project = {
		[PARTITION_KEY]: projectId,
		[SORT_KEY]: `project|${autoApproveFlag ? projectApprovedKey : projectPendingKey}|${randomNumber(1, 10)}`,
		created,
		...(autoApproveFlag ? {
			approved: created,
		} : {}),
		...projectCommon,
		pledgers: 1,
		favoritesAmount: 0,
		creator: userId,
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
		const emailData = autoApproveFlag
			? {
				dareTitle: project.title,
				dareTitleLink: projectHrefBuilder(projectId),
				recipients: [email],
				title: dareApprovedTitle,
			}
			: {
				dareTitle: project.title,
				dareTitleLink: projectHrefBuilder(projectId),
				recipients: [email],
				title: dareCreatedTitle,
			}
		sendEmail(emailData, autoApproveFlag ? dareApprovedEmail : dareCreatedEmail)
	} catch (err) {
		console.log('ses error')
	}

	return {
		id: projectId,
		userId,
		status: autoApproveFlag ? projectApprovedKey : projectPendingKey,
		...projectCommon,
		pledgers: 1,
		favoritesAmount: 0,
		creator: userId,
		created,
		...(autoApproveFlag ? {
			approved: created,
		} : {}),
	}
}
