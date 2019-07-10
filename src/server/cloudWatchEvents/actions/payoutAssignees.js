/* eslint-disable max-len */
// libs
import { head, path, length, equals } from 'ramda'
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
	await sendEmailToAssigneesWithoutPaypalEmail(usersWithoutPaypalMail)

	return {
		paypalPayout,
		usersNotPaid: usersWithoutPaypalMail,
	}
}
