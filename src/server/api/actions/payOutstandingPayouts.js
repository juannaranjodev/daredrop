import { assoc, equals, filter, head, length, map, path, prop, propEq, reduce, test } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import dynamoQueryShardedItems from 'root/src/server/api/actionUtil/dynamoQueryShardedItems'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'
import getUserMailFromAssigneeObj from 'root/src/server/api/actionUtil/getUserMailFromAssigneeObj'
import paypalBatchPayout from 'root/src/server/api/actionUtil/paypalBatchPayout'
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { payoutCompleteKey, payoutOutstandingKey, projectApprovedKey } from 'root/src/server/api/lenses'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { emailRe } from 'root/src/shared/util/regexes'


export default async () => {
	const payoutsOutstanding = await dynamoQueryShardedItems(payoutOutstandingKey)

	return reduce(async (acc, payout) => {
		const oldPayouts = await acc
		const projectId = prop('pk', payout)
		const payoutsWithPaypalEmails = await Promise.all(map(async (assignee) => {
			const userEmail = await getUserMailFromAssigneeObj(assignee)
			return assoc('email', userEmail, assignee)
		}, prop('assigneesToPay', payout)))

		const mailIsUndefined = filter(propEq('email', 'NO_EMAIL'))
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
					{
						DeleteRequest: {
							Key: {
								[PARTITION_KEY]: payout[PARTITION_KEY],
								[SORT_KEY]: payout[SORT_KEY],
							},
						},
					},
					equals(0, length(usersWithoutPaypalMail)) ? {
						PutRequest: {
							Item: {
								[PARTITION_KEY]: payout[PARTITION_KEY],
								[SORT_KEY]: await generateUniqueSortKey(projectId, payoutCompleteKey, 1, 10),
								payoutBatchId: path(['batch_header', 'payout_batch_id'], paypalPayout),
								statusCode: path(['httpStatusCode'], paypalPayout),
							},
						},
					}
						: {
							PutRequest: {
								Item: {
									[PARTITION_KEY]: payout[PARTITION_KEY],
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

		return [...oldPayouts, paypalPayout]
	}, Promise.resolve([]), payoutsOutstanding)
}
