import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import addPayoutMethodSerializer from 'root/src/server/api/serializers/addPayoutMethodSerializer'

export default async ({ userId, payload }) => {
	const payoutMethod = addPayoutMethodSerializer({ payload, userId })
	const putParams = {
		TableName: TABLE_NAME,
		Item: payoutMethod,
	}
	await documentClient.put(putParams).promise()
	return { ...putParams.Item }
}
