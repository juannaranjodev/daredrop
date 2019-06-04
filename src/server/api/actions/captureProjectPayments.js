import { reduce, assoc, prop, map, head } from 'ramda'
import dynamoQueryProjectPledges from 'root/src/server/api/actionUtil/dynamoQueryProjectPledges'
import capturePayments from 'root/src/server/api/actionUtil/capturePayments'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectToCaptureKey, projectCapturedKey } from 'root/src/server/api/lenses'
import { generalError } from 'root/src/server/api/errors'
import generateUniqueSortKey from 'root/src/server/api/actionUtil/generateUniqueSortKey'

export default async ({ payload }) => {
	const { projectId } = payload
	const projectCaptureQueryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :capture)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':capture': projectToCaptureKey,
		},
		ConsistentRead: true,
	}
	const projectToCaptureDdb = await documentClient.query(projectCaptureQueryParams).promise()

	const projectToCapture = head(dynamoItemsProp(projectToCaptureDdb))
	if (!projectToCapture) {
		throw generalError('There is no such a project to capture')
	}
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

	const captureToWrite = [{
		PutRequest: {
			Item: {
				[PARTITION_KEY]: projectId,
				[SORT_KEY]: await generateUniqueSortKey(projectId, projectCapturedKey, 1, 10),
			},
		},
	},
	{
		DeleteRequest: {
			Key: {
				[PARTITION_KEY]: projectToCapture[PARTITION_KEY],
				[SORT_KEY]: projectToCapture[SORT_KEY],
			},
		},
	}]
	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: captureToWrite,
		},
	}
	await documentClient.batchWrite(writeParams).promise()
	return { message: 'success' }
}
