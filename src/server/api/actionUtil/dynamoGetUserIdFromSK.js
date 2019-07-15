import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { GSI1_INDEX_NAME, GSI1_PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import { head, prop } from 'ramda'

export default sortKey => new Promise(async (resolve) => {
	const paymentMethodParams = {
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${GSI1_PARTITION_KEY} = :pk`,
		ExpressionAttributeValues: {
			':pk': `token-${sortKey}`,
		},
	}

	const dynamoResult = await documentClient.query(paymentMethodParams).promise()

	resolve(prop('pk', head(dynamoItemsProp(dynamoResult))))
})
