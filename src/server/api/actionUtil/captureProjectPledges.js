import { reduce, assoc, prop, map } from 'ramda'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'
import capturePayments from 'root/src/server/api/actionUtil/capturePayments'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'

export default async (projectId) => {
	const projectPledges = await dynamoQueryProjectPledges(projectId)
	const pledgesToWrite = await reduce(async (result, pledge) => {
		const payments = await capturePayments(prop('paymentInfo', pledge))
		const paymentInfoDdb = {
			TableName: TABLE_NAME,
			Item: assoc('paymentInfo', payments, pledge),
		}
		return [...result, paymentInfoDdb]
	}, [], projectPledges)
	// here we can't use batchWrite or transactWrite as those support only
	// 25(batchwrite) or 10(transactWrite) write items
	await Promise.all(map(pledge => documentClient.put(pledge).promise(), pledgesToWrite))
	console.log(JSON.stringify(pledgesToWrite, null, 2))
}
