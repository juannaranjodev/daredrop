import { head, prop } from 'ramda'
import dynamoQueryProject from 'root/src/server/api/actionUtil/dynamoQueryProject'
import getUserEmail from 'root/src/server/api/actionUtil/getUserEmail'
import projectHrefBuilder from 'root/src/server/api/actionUtil/projectHrefBuilder'
import streamVideoS3toYT from 'root/src/server/api/actionUtil/streamVideoS3toYT'
import { documentClient, TABLE_NAME } from 'root/src/server/api/dynamoClient'
import projectSerializer from 'root/src/server/api/serializers/projectSerializer'
import sendEmail from 'root/src/server/email/actions/sendEmail'
import videoSubmittedEmail from 'root/src/server/email/templates/videoSubmitted'
import { videoSubmittedTitle } from 'root/src/server/email/util/emailTitles'
import { PARTITION_KEY, SORT_KEY } from 'root/src/shared/constants/apiDynamoIndexes'
import { dynamoItemsProp, projectApprovedKey, projectDeliveryPendingKey } from 'root/src/shared/descriptions/apiLenses'
import { DELIVERY_DARE } from 'root/src/shared/descriptions/endpoints/endpointIds'
import { getPayloadLenses } from 'root/src/shared/descriptions/getEndpointDesc'

const payloadLenses = getPayloadLenses(DELIVERY_DARE)
const { viewDeliverySortKey, viewProjectId } = payloadLenses

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
	const [projectDdb, assigneesDdb] = await dynamoQueryProject(null, projectId, projectApprovedKey)

	const project = projectSerializer([
		...projectDdb,
		...assigneesDdb,
	])
	const s3DataWrite = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: deliveryProject[PARTITION_KEY],
				[SORT_KEY]: deliveryProject[SORT_KEY],
				...deliveryProject,
				s3Uploaded: true,
			},
		},
	}
	const projectDataToWrite = {
		PutRequest: {
			Item: {
				[PARTITION_KEY]: prop('id', project),
				[SORT_KEY]: head(projectDdb)[SORT_KEY],
				...head(projectDdb),
				status: projectDeliveryPendingKey,
			},
		},
	}
	const writeParams = {
		RequestItems: {
			[TABLE_NAME]: [s3DataWrite, projectDataToWrite],
		},
	}

	await documentClient.batchWrite(writeParams).promise()

	try {
		const email = await getUserEmail(userId)
		const emailData = {
			title: videoSubmittedTitle,
			dareTitle: prop('title', project),
			dareTitleLink: projectHrefBuilder(prop('id', project)),
			recipients: [email],
		}
		sendEmail(emailData, videoSubmittedEmail)
		// eslint-disable-next-line no-empty
	} catch (err) {
	}

	try {
		const youtubeUpload = await streamVideoS3toYT(project, deliveryProject, payload)

		return { projectId, youtubeUpload }
	} catch ({ message }) {
		return {
			projectId,
			message,
		}
	}
}
