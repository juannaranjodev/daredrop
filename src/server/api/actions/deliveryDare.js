import { getPayloadLenses } from 'root/src/server/api/getEndpointDesc'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { TABLE_NAME, documentClient } from 'root/src/server/api/dynamoClient'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import S3 from 'root/src/server/api/s3Client'
import { videoBucket } from 'root/cfOutput'
import googleOAuthClient, { youtube } from 'root/src/server/api/googleClient'
import { dynamoItemsProp, projectApprovedKey, streamerAcceptedKey, projectDeliveryPendingKey } from 'root/src/server/api/lenses'

import { youtubeBaseUrl } from 'root/src/shared/constants/youTube'
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import { map, prop, join, head } from 'ramda'
import moment from 'moment'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'

import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import { videoSubmittedTitle } from 'root/src/server/email/util/emailTitles'
import videoSubmittedEmail from 'root/src/server/email/templates/videoSubmitted'
import sendEmail from 'root/src/server/email/actions/sendEmail'

const payloadLenses = getPayloadLenses(DELIVERY_DARE)
const { viewDeliverySortKey, viewProjectId, viewTestName } = payloadLenses

export default async ({ payload, userId }) => {
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
	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])

	const projectUpdateParams = {
		TableName: TABLE_NAME,
		Key: {
			[PARTITION_KEY]: prop('id', project),
			[SORT_KEY]: head(projectDdb)[SORT_KEY],
		},
		UpdateExpression: 'SET #sts = :statusVal',
		ExpressionAttributeValues: {
			':statusVal': projectDeliveryPendingKey,
		},
		ExpressionAttributeNames: {
			'#sts': 'status',
		},
	}
	await documentClient.update(projectUpdateParams).promise()
	const acceptedAssignees = getAssigneesByStatus(project.assignees, streamerAcceptedKey)

	const displayPlusNewline = input => `${prop('displayName', input)}: https://www.twitch.tv/${prop('displayName', input)}\n`
	const ytDescription = `${join('', map(displayPlusNewline, acceptedAssignees))}${project.description}`

	const s3data = {
		Bucket: videoBucket,
		Key: process.env.STAGE === 'testing' ? viewTestName(payload) : deliveryProject.fileName,
	}
	try {
		const email = await getUserEmail(userId)
		const emailData = {
			title: videoSubmittedTitle,
			dareTitle: prop('title', project),
			recipients: [email],
		}
		sendEmail(emailData, videoSubmittedEmail)
	} catch (err) {
		console.log('ses error')
	}

	try {
		const fileStream = S3.getObject(s3data).createReadStream()
		const youtubeUpload = await youtube.videos.insert(
			{
				auth: await googleOAuthClient(),
				part: 'id,snippet,status',
				notifySubscribers: false,
				requestBody: {
					snippet: {
						title: project.title,
						description: ytDescription,
					},
					status: {
						privacyStatus: 'private',
						publishAt: moment().add(2, 'days').format('YYYY-MM-DDThh:mm:ss.sZ'),
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

		return { projectId, youtubeUpload }
	} catch ({ message }) {
		return {
			projectId,
			message,
		}
	}
}
