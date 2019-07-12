import { prop, head } from 'ramda'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY, GSI1_INDEX_NAME } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp } from 'root/src/shared/descriptions/apiLenses'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'

export default async (twitchID) => {
	const userData = await documentClient.query({
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${SORT_KEY} = :sk`,
		ExpressionAttributeValues: {
			':sk': `token-twitch|${twitchID}`,
		},
	}).promise()
	const email = await getUserEmail(prop(PARTITION_KEY, head(dynamoItemsProp(userData))))
	return email
}
