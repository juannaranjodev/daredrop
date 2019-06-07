import { head, add, prop, compose, map, not, length, assoc, equals, filter, propEq, omit, append } from 'ramda'

import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'

import sendEmail from 'root/src/server/email/actions/sendEmail'
import pledgeMadeMail from 'root/src/server/email/templates/pledgeMade'
import { pledgeMadeTitle } from 'root/src/server/email/util/emailTitles'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'

import { PLEDGE_PROJECT } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import pledgeDynamoObj from 'root/src/server/api/actionUtil/pledgeDynamoObj'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import validateStripeSourceId from 'root/src/server/api/actionUtil/validateStripeSourceId'
import stripeAuthorizePayment from 'root/src/server/api/actionUtil/stripeAuthorizePayment'
import { dynamoItemsProp, streamerAcceptedKey } from 'root/src/server/api/lenses'
import { payloadSchemaError, generalError } from 'root/src/server/api/errors'
import validatePaypalAuthorize from 'root/src/server/api/actionUtil/validatePaypalAuthorize'
import checkPledgedAmount from 'root/src/server/api/actionUtil/checkPledgedAmount'
import { dynamoItemsProp } from 'root/src/server/api/lenses'
import { stripeCard, paypalAuthorize } from 'root/src/shared/constants/paymentTypes'

const payloadLenses = getPayloadLenses(PLEDGE_PROJECT)
const { viewPledgeAmount, viewPaymentInfo } = payloadLenses

export default async ({ userId, payload }) => {
	const { projectId } = payload
	const [
		projectToPledgeDdb, assigneesDdb,
	] = await dynamoQueryProject(
		userId, projectId,
	)

	const projectToPledge = head(projectToPledgeDdb)
	if (!projectToPledge) {
		throw generalError('Project doesn\'t exist')
	}

	const newPledgeAmount = viewPledgeAmount(payload)
	let paymentInfo = viewPaymentInfo(payload)

	if (paymentInfo.paymentType === stripeCard) {
		const validationCardId = await validateStripeSourceId(paymentInfo.paymentId)
		if (!validationCardId) {
			throw payloadSchemaError({ stripeCardId: 'Invalid source id' })
		}
		const stripeAuthorization = await stripeAuthorizePayment(newPledgeAmount, paymentInfo.paymentId, userId)
		if (!stripeAuthorization.authorized) {
			throw payloadSchemaError(stripeAuthorization.error)
		}
		paymentInfo = assoc('paymentId', prop('id', stripeAuthorization), paymentInfo)
	} else if (paymentInfo.paymentType === paypalAuthorize) {
		const validation = await validatePaypalAuthorize(paymentInfo.orderID, newPledgeAmount)
		if (!validation) {
			throw payloadSchemaError({ paypalAuthorizationId: 'Invalid paypal authorization' })
		}
	}

	let myPledge = head(dynamoItemsProp(await documentClient.query({
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :pledgeUserId`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':pledgeUserId': `pledge|${userId}`,
		},
		ConsistentRead: true,
	}).promise()))

	const addPledgers = myPledge ? 0 : 1

	if (not(myPledge)) {
		myPledge = pledgeDynamoObj(
			projectId, projectToPledge, userId,
		)
	}

	const newMyPledge = assoc('paymentInfo', append(
		assoc('captured', 0, omit(['orderID'], paymentInfo)),
		prop('paymentInfo', myPledge),
	), myPledge)
	const updatedPledgeAmount = assoc('pledgeAmount', add(newPledgeAmount, prop('pledgeAmount', myPledge)), newMyPledge)

	const { pledgeAmount } = projectToPledge

	const pledgeParams = {
		TableName: TABLE_NAME,
		Item: updatedPledgeAmount,
	}

	await documentClient.put(pledgeParams).promise()

	const updateProjectParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: projectToPledge[PARTITION_KEY],
			[SORT_KEY]: projectToPledge[SORT_KEY],
		},
		UpdateExpression: 'SET pledgeAmount = :newPledgeAmount, pledgers = pledgers + :newPledgers',
		ExpressionAttributeValues: {
			':newPledgeAmount': pledgeAmount + newPledgeAmount,
			':newPledgers': addPledgers,
		},
	}

	await documentClient.update(updateProjectParams).promise()

	const newProject = projectSerializer([
		...projectToPledgeDdb,
		...assigneesDdb,
		myPledge,
	])

	try {
		const email = await getUserEmail(userId)

		const emailData = {
			title: pledgeMadeTitle,
			dareTitle: prop('title', newProject),
			recipients: [email],
			notClaimedAlready : addPledgers,
			dareHref: projectHrefBuilder(prop('id', newProject)),
			streamers: compose(map(prop('username')), prop('assignees'))(newProject),
			expiryTime: prop('created',projectToPledge)
		}
		sendEmail(emailData, pledgeMadeMail)
		await checkPledgedAmount(projectId)
	} catch (err) { }


	return {
		...newProject,
		userId,
		pledgeAmount: add(
			viewPledgeAmount(projectToPledge),
			newPledgeAmount,
		),
		myPledge: newPledgeAmount,
		pledgers: add(newProject.pledgers, addPledgers),
	}
}
