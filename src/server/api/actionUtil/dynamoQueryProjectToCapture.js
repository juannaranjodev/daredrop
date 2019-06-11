import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectToCaptureKey } from 'root/src/server/api/lenses'
import { generalError } from 'root/src/server/api/errors'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { head } from 'ramda'

export default async (projectId) => {
	const projectCaptureQueryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :capture)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':capture': projectToCaptureKey,
		},
		ConsistentRead: true,
	}
	const projectToCaptureDdb = await documentClient.query(projectCaptureQueryParams).promise()

	const projectToCapture = head(dynamoItemsProp(projectToCaptureDdb))
	if (!projectToCapture) {
		throw generalError('There is no such a project to capture')
	}
	return projectToCapture
}
