import { reduce, assoc, prop, map, unnest, path, anyPass, gte, lt, filter, __, gt, add } from 'ramda'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'
import capturePayments from 'root/src/server/api/actionUtil/capturePayments'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

export default async (projectId) => {
	const projectPledges = await dynamoQueryProjectPledges(projectId)
	const pledgesToWrite = await Promise.all(map(async (pledge) => {
		const payments = await capturePayments(prop('paymentInfo', pledge))
		const paymentInfoDdb = {
			TableName: TABLE_NAME,
			Item: assoc('paymentInfo', payments, pledge),
		}
		return paymentInfoDdb
	}, projectPledges))
	// here we can't use batchWrite or transactWrite as those support only
	// 25(batchwrite) or 10(transactWrite) write items
	await Promise.all(map(pledge => documentClient.put(pledge).promise(), pledgesToWrite))
	const captures = unnest(map(path(['Item', 'paymentInfo']), pledgesToWrite))
	const captureCodes = map(prop('captured'), captures)
	const badCodeFilter = filter(anyPass([lt(__, 200), gte(__, 300)]))
	const badCodeCaptures = badCodeFilter(captureCodes)
	if (gt(badCodeCaptures, 0)) {
		return false
	}

	return reduce((acc, item) => add(acc, prop('transactionNet', item)),
		0, captures)
}
