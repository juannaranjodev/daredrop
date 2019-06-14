import { SORT_KEY, PARTITION_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'
import {head} from 'ramda'

export default async (projectId, sortKeyBeginning) => {
	const queryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :projectId and begins_with(${SORT_KEY}, :skBeginning)`,
		ExpressionAttributeValues: {
			':projectId': projectId,
			':skBeginning': sortKeyBeginning,
		},
		ConsistentRead: true,
	}

	const recordToArchive = await documentClient.query(queryParams).promise()

	return head(dynamoItemsProp(recordToArchive))
}
