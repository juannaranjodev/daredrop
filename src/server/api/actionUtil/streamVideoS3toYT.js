import moment from 'moment'
import { join, map, prop } from 'ramda'
import outputs from 'root/cfOutput'
import getAssigneesByStatus from 'root/src/server/api/actionUtil/getAssigneesByStatus'
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'
import googleOAuthClient, { youtube } from 'root/src/server/api/googleClient'
import { streamerAcceptedKey } from 'root/src/shared/descriptions/apiLenses'
import S3 from 'root/src/server/api/s3Client'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { youtubeBaseUrl } from 'root/src/shared/constants/youTube'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import getTimestamp from 'root/src/shared/util/getTimestamp'

const payloadLenses = getPayloadLenses(DELIVERY_DARE)
const { viewTestName } = payloadLenses
const { videoBucket } = outputs

export default async (project, deliveryProject, payload) => {
	const acceptedAssignees = getAssigneesByStatus(project.assignees, streamerAcceptedKey)
	const displayPlusNewline = input => `${prop('displayName', input)}: https://www.twitch.tv/${prop('displayName', input)}\n`
	const ytDescription = `${join('', map(displayPlusNewline, acceptedAssignees))}${project.description}`

	const s3data = {
		Bucket: videoBucket,
		Key: process.env.STAGE !== 'testing' ? deliveryProject.fileName : viewTestName(payload),
	}

	try {
		const fileStream = S3.getObject(s3data).createReadStream()
		fileStream.on('error', error => error.message)

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
			UpdateExpression: 'SET youTubeURL = :youTubeURL, modidfied = :modified',
			ExpressionAttributeValues: {
				':youTubeURL': youtubeBaseUrl + youtubeUpload.data.id,
				':modified': getTimestamp(),
			},
		}
		await documentClient.update(ytUpdateParams).promise()
		return youtubeUpload
	} catch (err) {
		return err
	}
}
