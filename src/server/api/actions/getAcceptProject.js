import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import {
	GSI1_INDEX_NAME, GSI1_PARTITION_KEY,
} from 'root/src/shared/constants/apiDynamoIndexes'
import { projectAcceptedKey } from 'root/src/server/api/lenses'


export default async () => {
	const acceptedProjectParams = {
		TableName: TABLE_NAME,
		IndexName: GSI1_INDEX_NAME,
		KeyConditionExpression: `${GSI1_PARTITION_KEY} = :accepted`,
		ExpressionAttributeValues: {
			':accepted': `project|${projectAcceptedKey}`,
		},
	}
	const dynamoResults = await documentClient.query(
		acceptedProjectParams,
	).promise()
	return { items: dynamoResults.Items }
}
