import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import getTimestamp from 'root/src/shared/util/getTimestamp'
import addPaymentMethodSerializer from 'root/src/server/api/serializers/addPaymentMethodSerializer'

export default async ({ userId, payload }) => {
	const paymentMethod = addPaymentMethodSerializer(payload)
	const putParams = {
		TableName: TABLE_NAME,
		Item: {
			[PARTITION_KEY]: userId,
			created: getTimestamp(),
			...paymentMethod,
		},
	}
	await documentClient.put(putParams).promise()
	return { ...payload, id: payload.stripeCardId }
}
