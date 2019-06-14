import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { notFoundError } from 'root/src/server/api/errors'
import { equals, length } from 'ramda'

export default userId => new Promise(async (resolve, reject) => {
	const paymentMethodParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :paypal`,
		ExpressionAttributeValues: {
			':pk': userId,
			':paypal': 'payoutMethod|paypal',
		},
		ConsistentRead: true,
	}

	const dynamoResult = await documentClient.query(paymentMethodParams).promise()
	const payoutMethod = dynamoItemsProp(dynamoResult)
	if (equals(length(payoutMethod), 0)) {
		reject(notFoundError(`User ${userId} has no payout method set`))
	}
	resolve(payoutMethod)
})
