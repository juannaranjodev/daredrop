/* eslint-disable no-console */
/* eslint-disable max-len */
// libs
import { head, path, length, equals, prop, concat, forEach, not } from 'ramda'
// db stuff
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
// utils
import deleteCronJob from 'root/src/server/api/actionUtil/deleteCronJob'
import calculatePayouts from 'root/src/server/api/actionUtil/calculatePayouts'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import paypalBatchPayout from 'root/src/server/api/actionUtil/paypalBatchPayout'

// descriptions
import { PAYOUT_ASSIGNEES } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import { dynamoItemsProp, payoutCompleteKey, payoutOutstandingKey, projectToPayoutKey } from 'root/src/shared/descriptions/apiLenses'
import sendEmailToAssigneesWithoutPaypalEmail from 'root/src/server/api/actionUtil/sendEmailToAssigneesWithoutPaypalEmail'

// email
import sendEmail from 'root/src/server/email/actions/sendEmail'
import youHaveBeenPaidTemplate from 'root/src/server/email/templates/youHaveBeenPaid'
import getUserEmailByTwitchID from 'root/src/server/api/actionUtil/getUserEmailByTwitchID'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import { youHaveBeenPaidTitle } from 'root/src/server/email/util/emailTitles'

const payloadLenses = getPayloadLenses(PAYOUT_ASSIGNEES)
const { viewProjectId } = payloadLenses

export default async ({ payload }) => {
	const projectId = viewProjectId(payload)
	const payoutsWithPaypalEmails = await calculatePayouts(projectId)
	const { usersWithPaypalMail, usersWithoutPaypalMail } = payoutsWithPaypalEmails

	const payoutToSaveDdb = await documentClient.query({
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :projectId and begins_with(${SORT_KEY}, :payoutToSave)`,
		ExpressionAttributeValues: {
			':projectId': projectId,
			':payoutToSave': projectToPayoutKey,
		},
	}).promise()

	const payoutToSave = head(dynamoItemsProp(payoutToSaveDdb))

	const paypalPayout = equals(0, length(usersWithPaypalMail))
		? {
			batch_header: {
				payout_batch_id: 'no payouts to process',
			},
			httpStatusCode: 404,
		} : await paypalBatchPayout(payoutToSave, usersWithPaypalMail)

	const saveParams = {
		RequestItems: {
			[TABLE_NAME]: [
				{
					DeleteRequest: {
						Key: {
							[PARTITION_KEY]: payoutToSave[PARTITION_KEY],
							[SORT_KEY]: payoutToSave[SORT_KEY],
						},
					},
				},
				equals(0, length(usersWithoutPaypalMail)) ? {
					PutRequest: {
						Item: {
							[PARTITION_KEY]: payoutToSave[PARTITION_KEY],
							[SORT_KEY]: await generateUniqueSortKey(projectId, payoutCompleteKey, 1, 10),
							payoutBatchId: path(['batch_header', 'payout_batch_id'], paypalPayout),
							statusCode: path(['httpStatusCode'], paypalPayout),
						},
					},
				}
					: {
						PutRequest: {
							Item: {
								[PARTITION_KEY]: payoutToSave[PARTITION_KEY],
								[SORT_KEY]: await generateUniqueSortKey(projectId, payoutOutstandingKey, 1, 10),
								payoutBatchIds: [path(['batch_header', 'payout_batch_id'], paypalPayout)],
								statusCode: path(['httpStatusCode'], paypalPayout),
								assigneesToPay: usersWithoutPaypalMail,
							},
						},
					},
			],
		},
	}

	await documentClient.batchWrite(saveParams).promise()
	await deleteCronJob(PAYOUT_ASSIGNEES, projectId)

	try {
		if (not(equals(0, length(usersWithoutPaypalMail)))) {
			await sendEmailToAssigneesWithoutPaypalEmail(usersWithoutPaypalMail)
		}
	} catch (err) {
		console.log(JSON.stringify(err, null, 2))
	}

	const dareLink = projectHrefBuilder(projectId)
	const dareTitle = prop('dareTitle', payoutsWithPaypalEmails)

	await Promise.all(forEach(async (user) => {
		try {
			const email = await getUserEmailByTwitchID(prop('platformId', user))
			const emailData = {
				dareTitle,
				dareLink,
				amountRequest: prop('payout', user),
				paypalEmail: prop('email', user),
				title: youHaveBeenPaidTitle,
				recipients: [email],
			}
			await sendEmail(emailData, youHaveBeenPaidTemplate)
		} catch (err) {
			console.log(JSON.stringify(err, null, 2))
		}
	}, usersWithPaypalMail))

	return {
		paypalPayout,
		usersNotPaid: usersWithoutPaypalMail,
	}
}
