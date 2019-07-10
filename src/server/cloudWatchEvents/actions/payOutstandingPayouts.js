import { assoc, equals, filter, length, map, path, prop, propEq, reduce, test } from 'ramda'
import dynamoQueryShardedItems from 'root/src/server/api/actionUtil/dynamoQueryShardedItems'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getUserMailFromAssigneeObj from 'root/src/server/api/actionUtil/getUserMailFromAssigneeObj'
import paypalBatchPayout from 'root/src/server/api/actionUtil/paypalBatchPayout'
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { payoutCompleteKey, payoutOutstandingKey } from 'root/src/shared/descriptions/apiLenses'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { emailRe } from 'root/src/shared/util/regexes'
import sendEmailToAssigneesWithoutPaypalEmail from 'root/src/server/api/actionUtil/sendEmailToAssigneesWithoutPaypalEmail'

export default async () => {
	const payoutsOutstanding = await dynamoQueryShardedItems(payoutOutstandingKey)
	return reduce(async (acc, payout) => {
		const oldPayouts = await acc
		const projectId = prop('pk', payout)
		const payoutsWithPaypalEmails = await Promise.all(map(async (assignee) => {
			try {
				const userEmail = await getUserMailFromAssigneeObj(assignee)
				return assoc('email', userEmail, assignee)
			} catch (err) {
				return assoc('email', undefined, assignee)
			}
		}, prop('assigneesToPay', payout)))

		const mailIsUndefined = filter(propEq('email', undefined))
		const mailIsNotUndefined = filter(obj => test(emailRe, prop('email', obj)))

		const usersWithoutPaypalMail = mailIsUndefined(payoutsWithPaypalEmails)
		const usersWithPaypalMail = mailIsNotUndefined(payoutsWithPaypalEmails)
		const paypalPayout = equals(0, length(usersWithPaypalMail))
			? {
				batch_header: {
					payout_batch_id: 'no payouts to process',
				},
				httpStatusCode: 404,
			} : await paypalBatchPayout({ ...payout, pk: projectId }, usersWithPaypalMail)

		const saveParams = {
			RequestItems: {
				[TABLE_NAME]: [
					...equals(0, length(usersWithoutPaypalMail)) ? [
						{
							DeleteRequest: {
								Key: {
									[PARTITION_KEY]: payout[PARTITION_KEY],
									[SORT_KEY]: payout[SORT_KEY],
								},
							},
						},
						{
							PutRequest: {
								Item: {
									[PARTITION_KEY]: payout[PARTITION_KEY],
									[SORT_KEY]: await generateUniqueSortKey(projectId, payoutCompleteKey, 1, 10),
									payoutBatchId: path(['batch_header', 'payout_batch_id'], paypalPayout),
									statusCode: path(['httpStatusCode'], paypalPayout),
								},
							},
						}]
						: [{
							PutRequest: {
								Item: {
									[PARTITION_KEY]: payout[PARTITION_KEY],
									[SORT_KEY]: payout[SORT_KEY],
									payoutBatchIds: [...prop('payoutBatchIds', payout), path(['batch_header', 'payout_batch_id'], paypalPayout)],
									statusCode: path(['httpStatusCode'], paypalPayout),
									assigneesToPay: usersWithoutPaypalMail,
								},
							},
						}],
				],
			},
		}

		await documentClient.batchWrite(saveParams).promise()
		await sendEmailToAssigneesWithoutPaypalEmail(usersWithoutPaypalMail)

		return [...oldPayouts, paypalPayout]
	}, Promise.resolve([]), payoutsOutstanding)
}
