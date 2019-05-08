import randomNumber from 'root/src/shared/util/randomNumber'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { concat, toString } from 'ramda'

export default async (partitionKey, sortKeyBeginning, numberStartRange, numberEndRange) => {
	let repeatLoop = true
	while (repeatLoop) {
		const number = randomNumber(numberStartRange, numberEndRange)
		const queriedSK = concat(sortKeyBeginning, toString(number))
		const queryParams = {
			TableName: TABLE_NAME,
			KeyConditionExpression: `${PARTITION_KEY} = :pk and ${SORT_KEY} = :sk`,
			ExpressionAttributeValues: {
				':pk': partitionKey,
				':sk': queriedSK,
			},
		}
		const dynamoResult = await documentClient.query(queryParams).promise()
		if (dynamoResult.Items.length === 0) {
			repeatLoop = false
			return queriedSK
		}
	}
}
