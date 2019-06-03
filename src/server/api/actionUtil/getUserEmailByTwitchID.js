import { split, join, tail, filter, propEq, compose, prop, head } from 'ramda'
import {TABLE_NAME, documentClient} from 'root/src/server/api/dynamoClient'
import {GSI1_INDEX_NAME, GSI1_PARTITION_KEY} from 'root/src/shared/constants/apiDynamoIndexes'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'

export default async (twitchID) => {
	console.log(twitchID)
	const userData = await documentClient.query({
		TableName : TABLE_NAME,
		IndexName : GSI1_INDEX_NAME,
		KeyConditionExpression : `${GSI1_PARTITION_KEY} = :pk`,
		ExpressionAttributeValues :{
			':sk' : `token-twitch|${twitchID}`
		}
	}).promise()
	const email = await getUserEmail(prop('pk', userData))
	return email
}
