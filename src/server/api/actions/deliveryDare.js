import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import S3 from 'root/src/server/api/s3Client'
import { videoBucket } from 'root/cfOutput'
import googleOAuthClient, { youtube } from 'root/src/server/api/googleClient'
import { dynamoItemsProp, projectApprovedKey } from 'root/src/server/api/lenses'
import { youtubeBaseUrl } from 'root/src/shared/constants/youTube'
import dynamoQueryAllProjectAssignees from 'root/src/server/api/actionUtil/dynamoQueryAllProjectAssignees'
import getAcceptedAssignees from 'root/src/server/api/actionUtil/getAcceptedAssignees'
import { map, prop } from 'ramda'

const payloadLenses = getPayloadLenses(DELIVERY_DARE)
const { viewDeliverySortKey, viewProjectId } = payloadLenses

export default async ({ payload }) => {
	const deliverySortKey = viewDeliverySortKey(payload)
	const projectId = viewProjectId(payload)

	const deliveryQueryParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :projectId and ${SORT_KEY} = :deliveryDareSk`,
		ExpressionAttributeValues: {
			':projectId': projectId,
			':deliveryDareSk': deliverySortKey,
		},
	}

	const deliveryProjectDdb = await documentClient.query(deliveryQueryParams).promise()
	const [deliveryProject] = dynamoItemsProp(deliveryProjectDdb)

	const s3UpdateParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: deliveryProject[PARTITION_KEY],
			[SORT_KEY]: deliveryProject[SORT_KEY],
		},
		UpdateExpression: 'SET s3Uploaded = :s3Uploaded',
		ExpressionAttributeValues: {
			':s3Uploaded': true,
		},
	}

	await documentClient.update(s3UpdateParams).promise()

	const projectParams = {
		TableName: TABLE_NAME,
		KeyConditionExpression: `${PARTITION_KEY} = :pk and begins_with(${SORT_KEY}, :projectStatusKey)`,
		ExpressionAttributeValues: {
			':pk': projectId,
			':projectStatusKey': `project|${projectApprovedKey}|`,
		},
	}

	const projectDdb = await documentClient.query(projectParams).promise()
	const [project] = dynamoItemsProp(projectDdb)

	const projectAssignees = await dynamoQueryAllProjectAssignees(projectId)
	const acceptedAssignees = getAcceptedAssignees(projectAssignees)

	const displayNameOnNewline = input => `\n${prop('displayName', input)}`
	const ytDescription = `${project.description}${map(displayNameOnNewline, acceptedAssignees)}`

	const s3data = {
		Bucket: videoBucket,
		Key: deliveryProject.fileName,
	}

	const fileStream = S3.getObject(s3data).createReadStream()

	const youtubeUpload = await youtube.videos.insert(
		{
			auth: await googleOAuthClient,
			part: 'id,snippet',
			notifySubscribers: false,
			requestBody: {
				snippet: {
					title: project.title,
					description: ytDescription,
				},
			},
			media: {
				body: fileStream,
			},
		},
	)

	const ytUpdateParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: deliveryProject[PARTITION_KEY],
			[SORT_KEY]: deliveryProject[SORT_KEY],
		},
		UpdateExpression: 'SET youTubeURL = :youTubeURL',
		ExpressionAttributeValues: {
			':youTubeURL': youtubeBaseUrl + youtubeUpload.data.id,
		},
	}

	await documentClient.update(ytUpdateParams).promise()

	return { youtubeUpload }
}
