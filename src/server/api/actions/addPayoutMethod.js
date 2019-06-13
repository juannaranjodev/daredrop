import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import addPayoutMethodSerializer from 'root/src/server/api/serializers/addPayoutMethodSerializer'

export default async ({ userId, payload }) => {
	const payoutMethod = addPayoutMethodSerializer(payload)
	const putParams = {
		TableName: TABLE_NAME,
		Item: {
			[PARTITION_KEY]: userId,
			...payoutMethod,
		},
	}
	await documentClient.put(putParams).promise()
	return { ...putParams.Item }
}
